const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { greeting } = await req.json();
    const apiKey = Deno.env.get('ALIYUN_BAILIAN_API_KEY');
    
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    // 构建图片生成 prompt
    const imagePrompt = `Chinese New Year 2026 Year of the Horse greeting card design. 
Main content: "${greeting}"

Visual requirements:
- Style: Traditional Chinese art meets modern illustration, warm and festive
- Main subject: Cute, friendly cartoon horse character in joyful pose
- Color scheme: Vibrant red (#D32F2F, #E53935) and gold (#FFB300, #FFC107) as primary colors, with warm ivory (#FFF8E1) accents
- Background: Rich red gradient with subtle Chinese cloud patterns and golden decorative elements
- Decorations: Red lanterns, golden coins, plum blossoms, fireworks, auspicious clouds
- Text: The greeting text should be elegantly displayed in traditional Chinese calligraphy style with gold color
- Border: Ornate Chinese-style golden frame with traditional patterns
- Layout: Vertical composition (9:16 ratio), perfect for mobile phone screens
- Mood: Joyful, prosperous, warm, celebrating Chinese New Year
- Quality: High detail, sharp, vibrant colors, professional quality

The overall design should feel festive, auspicious, and perfect for sharing with family and friends during Chinese New Year.`;

    // 调用阿里云百炼图片生成 API
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'enable',
      },
      body: JSON.stringify({
        model: 'wanx-v1',
        input: {
          prompt: imagePrompt,
        },
        parameters: {
          size: '768*1344', // 9:16 比例
          n: 1,
          style: '<auto>',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // 检查是否是异步任务
    if (data.output?.task_id) {
      const taskId = data.output.task_id;
      
      // 轮询检查任务状态
      let imageUrl = null;
      let attempts = 0;
      const maxAttempts = 30; // 最多等待60秒
      
      while (attempts < maxAttempts && !imageUrl) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 每2秒检查一次
        
        const statusResponse = await fetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
        
        const statusData = await statusResponse.json();
        
        if (statusData.output?.task_status === 'SUCCEEDED') {
          imageUrl = statusData.output?.results?.[0]?.url;
          break;
        } else if (statusData.output?.task_status === 'FAILED') {
          throw new Error('Image generation failed');
        }
        
        attempts++;
      }
      
      if (!imageUrl) {
        throw new Error('Image generation timeout');
      }
      
      return new Response(
        JSON.stringify({ imageUrl }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    // 同步返回
    const imageUrl = data.output?.results?.[0]?.url;
    
    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    return new Response(
      JSON.stringify({ imageUrl }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate image' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
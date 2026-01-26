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

Main greeting text: "${greeting}"

Visual Style Requirements:
- Traditional Chinese festive art with modern illustration style
- Warm, joyful, auspicious atmosphere celebrating Chinese New Year
- Main subject: Cute, friendly cartoon horse character in dynamic, celebratory pose
- Color palette: Rich red (#D32F2F, #E53935) and bright gold (#FFB300, #FFC107) as primary colors, with ivory white (#FFF8E1) accents
- Background: Vibrant red gradient background with subtle Chinese traditional cloud patterns (祥云) and golden decorative elements

Decorative Elements:
- Traditional red lanterns hanging at top corners
- Golden coins and auspicious symbols scattered around
- Delicate plum blossom branches
- Subtle firework effects
- Chinese cloud patterns (祥云)
- Traditional border with ornate patterns

Text Display:
- The greeting text "${greeting}" should be prominently displayed in elegant Chinese calligraphy style
- Text color: gold with red outline for contrast
- Text positioned in the center or upper-center area
- Clear, legible, beautiful typography

Layout & Composition:
- Vertical orientation (9:16 ratio) optimized for mobile phone display
- Balanced composition with the horse character and greeting text as focal points
- Professional, high-quality design suitable for sharing with family and friends
- Border: Elegant Chinese-style decorative frame with traditional patterns

Technical Requirements:
- High resolution, sharp details, vibrant colors
- Professional quality illustration
- No watermarks or logos
- Clean, polished final result

The overall design should feel festive, prosperous, warm, and perfect for sharing Chinese New Year blessings with loved ones.`;

    console.log('Calling Aliyun image generation API...');

    // 调用阿里云百炼图片生成 API（新的同步接口）
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-image-max',
        input: {
          messages: [
            {
              role: 'user',
              content: [
                {
                  text: imagePrompt
                }
              ]
            }
          ]
        },
        parameters: {
          size: '928*1664', // 9:16 比例（竖屏）
          n: 1,
          prompt_extend: true,
          watermark: false,
          negative_prompt: '低分辨率，低画质，肢体畸形，手指畸形，画面过饱和，蜡像感，人脸无细节，过度光滑，画面具有AI感。构图混乱。文字模糊，扭曲。',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data));
    
    // 检查响应格式（新的同步接口返回格式）
    if (data.output?.choices?.[0]?.message?.content?.[0]?.image) {
      const imageUrl = data.output.choices[0].message.content[0].image;
      console.log('Image generated successfully:', imageUrl);
      
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
    
    // 如果响应格式不对，打印详细信息
    console.error('Unexpected response format:', JSON.stringify(data));
    throw new Error('Unexpected response format from image generation API');

  } catch (error) {
    console.error('Error details:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate image',
        details: error.toString()
      }),
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
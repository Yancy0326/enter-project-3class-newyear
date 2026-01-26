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
    const apiKey = Deno.env.get('ALIYUN_BAILIAN_API_KEY');
    
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    // 调用阿里云百炼 API 生成贺词
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-max',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的新春贺词撰写专家。请创作温馨、喜庆的马年新春贺词。'
          },
          {
            role: 'user',
            content: `请为2026马年春节创作一段新春贺词。要求：
1. 必须包含"马年"相关元素，如"马到成功"、"龙马精神"、"一马当先"等
2. 字数控制在60-120字之间
3. 语言亲切、温暖，适合长辈使用
4. 包含对家人、朋友的美好祝愿
5. 富有中国传统文化气息
6. 直接输出贺词，不需要任何标题、解释或其他额外内容`
          }
        ],
        temperature: 0.85,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const greeting = data.choices[0]?.message?.content?.trim() || '';

    return new Response(
      JSON.stringify({ greeting }),
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
      JSON.stringify({ error: error.message || 'Failed to generate greeting' }),
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
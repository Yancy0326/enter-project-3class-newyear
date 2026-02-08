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
    const { prompt, sessionId } = await req.json();
    const apiKey = Deno.env.get('ALIYUN_BAILIAN_API_KEY');
    
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log('Calling travel agent API with prompt:', prompt);
    console.log('Session ID:', sessionId);

    // 调用阿里云百炼旅行规划智能体应用 API
    const appId = '2bf6455b18ce4249bdc65a00018f78f8';
    const response = await fetch(`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          prompt: prompt,
          ...(sessionId && { session_id: sessionId })
        },
        parameters: {},
        debug: {}
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data));
    
    // 检查响应格式
    if (data.output?.text) {
      const result = {
        text: data.output.text,
        sessionId: data.output.session_id || sessionId || '',
        finishReason: data.output.finish_reason || 'stop'
      };
      
      console.log('Returning result:', result);
      
      return new Response(
        JSON.stringify(result),
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
    throw new Error('Unexpected response format from agent API');

  } catch (error) {
    console.error('Error details:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to chat with travel agent',
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
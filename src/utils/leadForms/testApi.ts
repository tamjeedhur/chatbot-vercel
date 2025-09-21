// Test the API endpoint with chatbotId filtering
export async function testLeadFormsAPI(serverUrl: string, accessToken: string, chatbotId: string) {
  try {
    console.log('Testing lead forms API with chatbotId:', chatbotId);
    
    // Test without chatbotId filter
    const response1 = await fetch(`${serverUrl}/api/v1/ai-support/lead-forms`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const data1 = await response1.json();
    console.log('Response without chatbotId filter:', data1);
    
    // Test with chatbotId filter
    const response2 = await fetch(`${serverUrl}/api/v1/ai-support/lead-forms?chatbotId=${chatbotId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const data2 = await response2.json();
    console.log('Response with chatbotId filter:', data2);
    
    return {
      withoutFilter: data1,
      withFilter: data2
    };
  } catch (error) {
    console.error('Error testing API:', error);
    throw error;
  }
}


import { transformToBackendPayload } from './leadFormsTransform';
import { LeadFormConfig } from '@/types/leadForms';

// Test the payload structure
export function testPayloadStructure() {
  const testConfig: Omit<LeadFormConfig, 'id' | 'createdAt'> = {
    title: 'Collect Info',
    description: 'When certain keywords are used',
    keywords: ['help'],
    fields: [
      { 
        id: '1', 
        type: 'text', 
        label: 'Name', 
        placeholder: 'Enter your name', 
        required: true 
      },
      { 
        id: '2', 
        type: 'email', 
        label: 'Email', 
        placeholder: 'Enter your email', 
        required: true 
      }
    ],
    collectCondition: 'keywords',
    fieldsDisplay: 'all-at-once'
  };

  const testChatbotId = 'test-chatbot-id';
  
  const payload = transformToBackendPayload(testConfig, testChatbotId);
  
  console.log('Test Payload Structure:');
  console.log(JSON.stringify(payload, null, 2));
  
  return payload;
}


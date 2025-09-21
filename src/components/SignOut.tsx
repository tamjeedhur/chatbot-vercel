// "use client"


import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@chakra-ui/react';

export default function SignOut() {
  const supabase = createClientComponentClient();

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      // eslint-disable-next-line no-console
      console.error('ERROR:', error);
    }
  }

  return (
        <Button
                  
    //   fontFamily="Plus Jakarta Sans"
p='7px 15px'
onClick={handleSignOut}
    fontSize={['14px', '14px', '16px', '18px']}
    lineHeight={['16px', '18px', '20px', '24px']}               fontStyle="normal"
    fontWeight="600"
    cursor="pointer"

    color='#FFF'
    borderRadius='12px'
    background='linear-gradient(rgb(125, 102, 245) 0%, rgb(74, 41, 194) 100%)'
    textShadow="1px 1px 3px rgba(0, 0, 0, 0.10)"
    _hover={{
      transform: 'scale(1.05)',
    }}>
      Sign Out
    </Button>
  );
}

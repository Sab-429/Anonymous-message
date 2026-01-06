import { Body, Button, Container, Head, Heading, Html, Img, Preview, Section, Tailwind, Text } from '@react-email/components';

interface WelcomeEmailProps {
  username : string,
  otp:string;
}
export default function verificationemail({username,otp}
:WelcomeEmailProps){
return (
    <Html>
      <Head />
      <title>Verification Code</title>
      <Tailwind>
        <Body style={{ backgroundColor: 'black', margin: 'auto', fontFamily: 'var(--font-sans)' }}>
          <Container style={{ marginBottom: '40px', marginLeft: 'auto', marginRight: 'auto', padding: '20px', width: '465px' }}>
            <Section style={{ marginTop: '40px' }}>
              <Img
                src={`https://example.com/brand/example-logo.png`}
                width="60"
                height="60"
                alt="Logo Example"
                style={{ margin: '0', marginLeft: 'auto', marginRight: 'auto' }}
              />
            </Section>
            <Heading style={{ fontSize: '24px', color: 'white', fontWeight: 'normal', textAlign: 'center', margin: '0', marginTop: '32px', marginLeft: '0', marginRight: '0' }}>
              welcome {username}
            </Heading>
            <Text style={{ textAlign: 'start', fontSize: '14px', color: 'white', lineHeight: '1.625' }}>
              To complete registration verify through the given OTP 
            </Text>
            <Text style={{ fontSize: '24px', color: 'white', fontWeight: 'normal', textAlign: 'center', margin: '0', marginTop: '32px', marginLeft: '0', marginRight: '0' }}>
              Your OTP <strong>{otp}</strong>.
            </Text>
            <Section style={{ textAlign: 'center', marginTop: '32px', marginBottom: '32px' }}>
              <Button
                style={{ padding: '10px 20px', backgroundColor: 'white', borderRadius: '6px', color: 'black', fontSize: '14px', fontWeight: 'semibold', textDecoration: 'none', textAlign: 'center' }}
                href={`https://example.com/get-started`}
              >
                Get Started
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

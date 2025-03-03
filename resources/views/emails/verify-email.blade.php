@component('mail::message')
# Verify Your Email Address

Hello {{ $user->name ?? 'there' }},

Thank you for registering with Signal Dashboard! Please click the button below to verify your email address.

@component('mail::button', ['url' => $url])
Verify Email Address
@endcomponent

If you did not create an account, no further action is required.

Best regards, <br>
Signal Dashboard Team

@component('mail::subcopy')
If you're having trouble clicking the "Verify Email Address" button, copy and paste the URL below into your web browser: {{ $url }}
@endcomponent
@endcomponent 
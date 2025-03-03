@component('vendor.mail.html.message')
# Verify Your Email Address

Hello {{ $user->name ?? 'there' }},

Thank you for registering with {{ config('app.name') }}! Please click the button below to verify your email address.

@component('vendor.mail.html.button', ['url' => $url])
Verify Email Address
@endcomponent

If you did not create an account, no further action is required.

Best regards,<br>
{{ config('app.name') }} Team

@component('vendor.mail.html.subcopy')
If you're having trouble clicking the "Verify Email Address" button, copy and paste the URL below into your web browser: {{ $url }}
@endcomponent
@endcomponent 
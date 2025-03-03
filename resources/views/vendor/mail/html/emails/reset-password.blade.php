@component('vendor.mail.html.message')
# Reset Password Notification

Hello!

You are receiving this email because we received a password reset request for your account.

@component('vendor.mail.html.button', ['url' => $url])
Reset Password
@endcomponent

This password reset link will expire in {{ config('auth.passwords.'.config('auth.defaults.passwords').'.expire') }} minutes.

If you did not request a password reset, no further action is required.

Best regards,<br>
{{ config('app.name') }} Team

@component('vendor.mail.html.subcopy')
If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser: {{ $url }}
@endcomponent
@endcomponent 
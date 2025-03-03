@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="https://img.carsdn.co/image/upload/v1740878392/purple-signal-logo.png" style="width: 150px; height: 75px; display: block; margin: 0 auto;" alt="Signal Dashboard Logo">
@else
{{ $slot }}
@endif
</a>
</td>
</tr>

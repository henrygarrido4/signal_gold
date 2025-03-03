<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AllowedDomain implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $allowedDomains = ['cars.com', 'carscommerce.inc'];
        $domain = substr(strrchr($value, "@"), 1);
        
        if (!in_array($domain, $allowedDomains)) {
            $fail('The :attribute must be a company email address (@cars.com or @carscommerce.inc).');
        }
    }
} 
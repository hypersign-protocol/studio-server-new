import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class SanitizeUrlValidator implements ValidatorConstraintInterface {
  validate(urls: any[], args: ValidationArguments) {
    const cleanedUrls = urls.map((url) => url.replace(/\/$/, ''));
    const uniqueUrls = Array.from(new Set(cleanedUrls));
    args.object['whitelistedCors'] = uniqueUrls; // Set the cleaned array back to the object
    return true;
  }
}

export function urlSanitizer(url, endsWith) {
  switch (endsWith) {
    case true: {
      if (url.endsWith('/')) {
        return url;
      } else {
        return url + '/';
      }
    }
    case false: {
      if (url.endsWith('/')) {
        return url.slice(0, -1);
      } else {
        return url;
      }
    }
    default:
      return url;
  }
}

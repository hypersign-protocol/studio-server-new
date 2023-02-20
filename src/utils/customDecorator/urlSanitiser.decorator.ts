export const SanitizeUrl = () => (target, key, descriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args) {
    const urls = args[0].body.whitelistedCors;
    const cleanedUrls = urls.map((url) => url.replace(/\/$/, ''));
    const uniqueUrls = Array.from(new Set(cleanedUrls));
    args[0].body.whitelistedCors = uniqueUrls;
    return originalMethod.apply(this, args);
  };
  return descriptor;
};

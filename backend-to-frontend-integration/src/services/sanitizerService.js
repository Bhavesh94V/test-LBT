import sanitizeHtml from 'sanitize-html';

class SanitizerService {
  // Sanitize string input
  sanitizeString(input) {
    if (!input || typeof input !== 'string') return input;
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .substring(0, 5000); // Limit length
  }

  // Sanitize email
  sanitizeEmail(email) {
    if (!email || typeof email !== 'string') return email;
    
    return email.toLowerCase().trim();
  }

  // Sanitize phone
  sanitizePhone(phone) {
    if (!phone || typeof phone !== 'string') return phone;
    
    return phone.replace(/[^0-9+\-]/g, '');
  }

  // Sanitize HTML content
  sanitizeHtmlContent(html) {
    if (!html || typeof html !== 'string') return html;

    return sanitizeHtml(html, {
      allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3'],
      allowedAttributes: {
        'a': ['href', 'title', 'target']
      },
      allowedSchemes: ['http', 'https', 'mailto'],
      allowedSchemesAppliedToAttributes: ['href', 'src'],
      nonCharacterReferenceAllowedCharReferenceExceptions: []
    });
  }

  // Sanitize object recursively
  sanitizeObject(obj, maxDepth = 5, currentDepth = 0) {
    if (currentDepth > maxDepth) return null;
    if (!obj) return obj;
    if (typeof obj !== 'object') return this.sanitizeString(obj);

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item, maxDepth, currentDepth + 1));
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = this.sanitizeString(key);
      sanitized[sanitizedKey] = this.sanitizeObject(value, maxDepth, currentDepth + 1);
    }
    return sanitized;
  }

  // Remove sensitive fields
  removeSensitiveFields(obj, sensitiveFields = ['password', 'token', 'secret', 'apiKey']) {
    if (!obj || typeof obj !== 'object') return obj;

    const cleaned = { ...obj };
    sensitiveFields.forEach(field => {
      delete cleaned[field];
    });
    return cleaned;
  }

  // Validate and sanitize address
  sanitizeAddress(address) {
    if (!address || typeof address !== 'string') return address;

    return address
      .trim()
      .replace(/[<>]/g, '')
      .substring(0, 500);
  }

  // Sanitize URL
  sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return url;

    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return null;
      }
      return urlObj.toString();
    } catch {
      return null;
    }
  }

  // Sanitize file name
  sanitizeFileName(fileName) {
    if (!fileName || typeof fileName !== 'string') return fileName;

    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .substring(0, 255);
  }

  // Sanitize search query
  sanitizeSearchQuery(query) {
    if (!query || typeof query !== 'string') return query;

    return query
      .trim()
      .replace(/[<>]/g, '')
      .replace(/[*+?^${}()|[\]\\]/g, '\\$&') // Escape regex special chars
      .substring(0, 200);
  }

  // Sanitize pagination params
  sanitizePaginationParams(page, limit) {
    const maxLimit = 100;
    const sanitizedPage = Math.max(1, parseInt(page) || 1);
    const sanitizedLimit = Math.min(maxLimit, Math.max(1, parseInt(limit) || 10));

    return { page: sanitizedPage, limit: sanitizedLimit };
  }

  // Sanitize sort params
  sanitizeSortParams(sort, allowedFields = []) {
    if (!sort || typeof sort !== 'string') return {};

    const parts = sort.split(':');
    const field = parts[0];
    const order = (parts[1] === 'desc') ? -1 : 1;

    if (allowedFields.length > 0 && !allowedFields.includes(field)) {
      return {};
    }

    return { [field]: order };
  }

  // Sanitize filter params
  sanitizeFilterParams(filters, allowedFields = []) {
    if (!filters || typeof filters !== 'object') return {};

    const sanitized = {};
    for (const [key, value] of Object.entries(filters)) {
      if (allowedFields.length > 0 && !allowedFields.includes(key)) continue;
      sanitized[key] = value;
    }
    return sanitized;
  }
}

export default new SanitizerService();

"""Utility functions for the application."""

import bleach


# Allowed HTML tags based on Tiptap StarterKit capabilities
ALLOWED_TAGS = [
    'p', 'br',
    'strong', 'em', 'u', 's', 'code',
    'h1', 'h2', 'h3',
    'ul', 'ol', 'li',
    'blockquote',
    'a',
]

# Allowed attributes for specific tags
ALLOWED_ATTRIBUTES = {
    'a': ['href', 'title', 'target', 'rel'],
}

# Allowed URL schemes for links
ALLOWED_PROTOCOLS = ['http', 'https', 'mailto']


def sanitize_html(content: str) -> str:
    """
    Sanitize HTML content to prevent XSS attacks.
    
    Only allows HTML tags and attributes that are supported by Tiptap StarterKit.
    
    Args:
        content: Raw HTML content to sanitize
        
    Returns:
        Sanitized HTML content safe for storage and display
    """
    if not content:
        return content
    
    # Sanitize HTML: remove disallowed tags and attributes
    sanitized = bleach.clean(
        content,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        protocols=ALLOWED_PROTOCOLS,
        strip=True,
    )
    
    return sanitized


def strip_html_tags(content: str) -> str:
    """
    Strip all HTML tags from content, returning plain text.
    
    Useful for generating previews or search indexes.
    
    Args:
        content: HTML content
        
    Returns:
        Plain text without HTML tags
    """
    if not content:
        return content
    
    return bleach.clean(content, tags=[], strip=True)


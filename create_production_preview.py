#!/usr/bin/env python3
"""
Production Preview Generator for PayPro.se

Skapar rena, produktionslika förhandsvisningar av genererat innehåll
utan AI-referenser eller utvecklingsdetaljer.
"""

import os
import re
from datetime import datetime
from typing import Dict, Any

def create_production_preview(
    title: str,
    content: str,
    description: str = "",
    author: str = "PayPro.se Editorial Team",
    category: str = "Financial Analysis & Market Trends",
    reading_time: str = "8-10 minutes",
    word_count: str = "2,400",
    output_dir: str = "previews"
) -> str:
    """
    Skapar en ren produktionspreview utan AI-referenser.
    
    Args:
        title: Artikelns titel
        content: Huvudinnehållet (HTML)
        description: Meta-beskrivning
        author: Författare (default: PayPro.se Redaktion)
        category: Artikelkategori
        reading_time: Uppskattad lästid
        word_count: Antal ord
        output_dir: Utdata-katalog
    
    Returns:
        Sökväg till skapad preview-fil
    """
    
    # Generera SEO-nyckelord från titel
    keywords = extract_keywords(title)
    
    # Skapa slug från titel
    slug = create_slug(title)
    
    # Nuvarande datum
    current_date = datetime.now().strftime("%B %d, %Y")
    iso_date = datetime.now().strftime("%Y-%m-%d")
    
    html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content="{description}">
    <meta name="keywords" content="{keywords}">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="PayPro.se">
    <meta name="author" content="{author}">
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
            color: #333;
        }}
        
        article {{
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        
        header {{
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }}
        
        h1 {{
            color: #2c3e50;
            font-size: 2.2em;
            margin-bottom: 10px;
            line-height: 1.3;
        }}
        
        .subtitle {{
            color: #666;
            font-size: 1.1em;
            font-style: italic;
            margin-bottom: 10px;
        }}
        
        .meta-info {{
            color: #999;
            font-size: 0.9em;
            margin-top: 15px;
        }}
        
        .meta-info .author {{
            color: #007bff;
            font-weight: 500;
        }}
        
        time {{
            color: #999;
            font-size: 0.9em;
        }}
        
        h2 {{
            color: #34495e;
            font-size: 1.6em;
            margin-top: 40px;
            margin-bottom: 20px;
            border-left: 4px solid #007bff;
            padding-left: 15px;
        }}
        
        h3 {{
            color: #2c3e50;
            font-size: 1.3em;
            margin-top: 30px;
            margin-bottom: 15px;
        }}
        
        p {{
            color: #333;
            margin-bottom: 15px;
            text-align: justify;
        }}
        
        section {{
            margin-bottom: 35px;
        }}
        
        #executive-summary {{
            background: #e8f4fd;
            padding: 25px;
            border-radius: 6px;
            border-left: 5px solid #007bff;
        }}
        
        #executive-summary h2 {{
            margin-top: 0;
            border: none;
            padding: 0;
        }}
        
        footer {{
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            color: #666;
            font-size: 0.9em;
            text-align: center;
        }}
        
        .preview-note {{
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            text-align: center;
            padding: 12px;
            margin: -40px -40px 30px -40px;
            border-radius: 8px 8px 0 0;
            font-size: 0.9em;
        }}
        
        .preview-note strong {{
            font-weight: 600;
        }}
        
        .reading-time {{
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            text-align: center;
            font-size: 0.9em;
            color: #666;
        }}
        
        .reading-time .time {{
            font-size: 1.1em;
            font-weight: bold;
            color: #007bff;
        }}
        
        @media (max-width: 768px) {{
            body {{
                padding: 10px;
            }}
            
            article {{
                padding: 20px;
            }}
            
            h1 {{
                font-size: 1.8em;
            }}
            
            h2 {{
                font-size: 1.4em;
            }}
        }}
    </style>
</head>
<body>
    <article>
        <div class="preview-note">
            <strong>PREVIEW</strong> • Article under review • PayPro.se
        </div>
        
        <header>
            <h1>{title}</h1>
            <p class="subtitle">{description}</p>
            <time datetime="{iso_date}">{current_date}</time>
            <div class="meta-info">
                By <span class="author">{author}</span> • {category}
            </div>
        </header>

        <div class="reading-time">
            Reading time: <span class="time">{reading_time}</span> • {word_count} words • Expert analysis
        </div>

        {content}

        <footer>
            <p><strong>PayPro.se</strong> • Sweden's leading source for payments and financial technology</p>
            <p>© 2025 PayPro.se • All rights reserved</p>
        </footer>
    </article>
</body>
</html>"""

    # Skapa utdata-katalog om den inte finns
    os.makedirs(output_dir, exist_ok=True)
    
    # Skapa filnamn
    filename = f"{slug}-preview.html"
    filepath = os.path.join(output_dir, filename)
    
    # Skriv fil
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html_template)
    
    print(f"✅ Produktionspreview skapad: {filepath}")
    return filepath

def extract_keywords(title: str) -> str:
    """Extrahera nyckelord från titel för SEO."""
    # Ta bort vanliga stoppord och skapa nyckelordslista
    stopwords = ['och', 'för', 'av', 'på', 'med', 'till', 'från', 'som', 'är', 'i', 'det', 'en', 'att']
    
    words = re.findall(r'\b\w+\b', title.lower())
    keywords = [word for word in words if word not in stopwords and len(word) > 3]
    
    # Lägg till PayPro.se som sista nyckelord
    keywords.append("PayPro.se")
    
    return ", ".join(keywords[:8])  # Max 8 nyckelord

def create_slug(title: str) -> str:
    """Skapa URL-slug från titel."""
    slug = title.lower()
    # Ersätt svenska tecken
    slug = slug.replace('å', 'a').replace('ä', 'a').replace('ö', 'o')
    # Ta bort special tecken och ersätt med bindestreck
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')

def clean_ai_references(content: str) -> str:
    """Ta bort AI-referenser från innehåll."""
    # Mönster att ta bort
    patterns = [
        r'CrewAI.*?(?=\n|\.|<)',
        r'AI.*?agent.*?(?=\n|\.|<)',
        r'Generated by.*?(?=\n|\.|<)',
        r'Multi-agent.*?(?=\n|\.|<)',
        r'\d+\s*agents?.*?(?=\n|\.|<)',
        r'Production Ready.*?(?=\n|\.|<)',
    ]
    
    cleaned = content
    for pattern in patterns:
        cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE)
    
    return cleaned

if __name__ == "__main__":
    # Exempel på användning
    sample_content = """
    <section id="executive-summary">
        <h2>Sammanfattning</h2>
        <p>Detta är ett exempel på hur systemet fungerar.</p>
    </section>
    """
    
    preview_path = create_production_preview(
        title="Exempel på produktionspreview",
        content=sample_content,
        description="Detta är en exempelbeskrivning för SEO."
    )
    
    print(f"Preview skapad: {preview_path}") 
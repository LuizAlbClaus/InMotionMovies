import re
from html.parser import HTMLParser

filepath = "/Users/luizalbertoclausmaronna/.gemini/antigravity/brain/329261da-c972-47ac-9f2d-25d7e213733c/.system_generated/steps/30/content.md"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

html_start = content.find("<!doctype html>")
if html_start != -1:
    html_content = content[html_start:]
else:
    html_content = content

class OutlineParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.current_tag = None
        self.in_title_or_heading = False
        self.heading_text = ""
        self.headings = []
        self.sections = []
        self.videos = []
        self.links = []
        
    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
        attrs_dict = dict(attrs)
        
        # Check headings
        if tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            self.in_title_or_heading = True
            self.heading_text = ""
            
        # Check sections & divs with id/class
        if tag in ['section', 'div', 'main', 'header']:
            tag_id = attrs_dict.get('id')
            tag_class = attrs_dict.get('class')
            if tag_id or tag_class:
                self.sections.append((tag, tag_id, tag_class))
                
        # Check video/iframe/source
        if tag in ['video', 'iframe', 'source']:
            src = attrs_dict.get('src') or attrs_dict.get('data-src') or attrs_dict.get('data-video-src')
            self.videos.append((tag, src, attrs_dict.get('class')))
            
        # Check links
        if tag in ['a', 'button']:
            self.in_title_or_heading = True
            self.heading_text = f"[{tag.upper()} href={attrs_dict.get('href')}] "

    def handle_endtag(self, tag):
        if tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'button']:
            if self.in_title_or_heading:
                text = self.heading_text.strip()
                if tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                    self.headings.append((tag, text))
                else:
                    self.links.append(text)
                self.in_title_or_heading = False
        self.current_tag = None

    def handle_data(self, data):
        if self.in_title_or_heading:
            self.heading_text += data

parser = OutlineParser()
parser.feed(html_content)

print("--- HEADINGS ---")
for tag, text in parser.headings:
    print(f"{tag}: {text}")

print("\n--- SECTIONS & IDS ---")
for tag, tag_id, tag_class in parser.sections[:50]: # limit to 50
    print(f"Tag: {tag}, ID: {tag_id}, Class: {tag_class}")

print("\n--- VIDEOS & IFRAMES ---")
for tag, src, tag_class in parser.videos:
    print(f"Tag: {tag}, Src: {src}, Class: {tag_class}")

print("\n--- LINKS & BUTTONS (First 40) ---")
for link in parser.links[:40]:
    print(link)

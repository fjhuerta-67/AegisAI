import urllib.request
import json
import time
import os

api_key = ''
with open('.env') as f:
    for line in f:
        if line.startswith('GEMINI_API_KEY='):
            api_key = line.strip().split('=', 1)[1].strip('"\'')

with open('/tmp/translated_prompts.json', 'r', encoding='utf-8') as f:
    prompts = json.load(f)

# Find prompts that need translation
# Note: ID 1 is already English "open all files in this folder..."
spanish_starters = ['es', 'puedes', 'esta', 'la', 'adelante', 'si', 'no', 'haz', 'crea', 'cambia', 'agrega', 'pon', 'quiero', 'dime', 'necesito', 'hola', 'tengo', 'cargo', 'para', 'uff', 'creo', 'como', 'ayudame']

def needs_translation(p):
    orig = p['original'].strip()
    trans = p['translated'].strip()
    if orig == trans:
        # Check if original is Spanish
        words = orig.lower().split()
        if words and any(w in spanish_starters for w in words[:3]):
            return True
        if any(c in orig for c in 'áéíóúñ¿¡'):
            return True
    return False

to_translate = [p for p in prompts if needs_translation(p)]
print(f"Total items needing translation: {len(to_translate)}")

def call_gemini(batch):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={api_key}"
    prompt_text = """You are an expert technical translator. Translate these software engineering prompts from Spanish to fluent, professional English. Keep technical terms exact.
Format: Return ONLY a JSON array with objects containing 'id', 'translated' (the English translation), and 'category' (2-4 word technical topic).

Input:
""" + json.dumps([{'id': x['id'], 'original': x['original']} for x in batch], ensure_ascii=False)

    payload = json.dumps({
        'contents': [{'parts': [{'text': prompt_text}]}],
        'generationConfig': {'responseMimeType': 'application/json'}
    }).encode('utf-8')

    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=45) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        text = res['candidates'][0]['content']['parts'][0]['text']
        return json.loads(text)

batch_size = 12
for i in range(0, len(to_translate), batch_size):
    batch = to_translate[i:i+batch_size]
    print(f"Translating batch {i//batch_size + 1}/{(len(to_translate)-1)//batch_size + 1} (IDs: {[x['id'] for x in batch]})...")
    
    success = False
    for attempt in range(3):
        try:
            results = call_gemini(batch)
            for res_item in results:
                target_id = res_item.get('id')
                for p in prompts:
                    if p['id'] == target_id:
                        p['translated'] = res_item.get('translated', p['original'])
                        p['category'] = res_item.get('category', p.get('category', 'Engineering'))
            success = True
            break
        except Exception as e:
            print(f"  Attempt {attempt+1} failed: {e}. Retrying in 2s...")
            time.sleep(2)
    
    if not success:
        print(f"Failed to translate batch starting at index {i}")
    time.sleep(1)

with open('/tmp/translated_prompts.json', 'w', encoding='utf-8') as f:
    json.dump(prompts, f, indent=2, ensure_ascii=False)

print("Translation completed and saved to /tmp/translated_prompts.json!")

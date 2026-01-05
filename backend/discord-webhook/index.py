import json
import os
import requests

def handler(event: dict, context) -> dict:
    """
    Принимает webhook от Discord и пересылает уведомления в Telegram бот
    """
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    telegram_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    telegram_chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not telegram_token or not telegram_chat_id:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Telegram credentials not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        body = event.get('body', '{}')
        if isinstance(body, str):
            discord_data = json.loads(body)
        else:
            discord_data = body
        
        author = discord_data.get('author', {})
        username = author.get('username', 'Unknown')
        content = discord_data.get('content', '')
        embeds = discord_data.get('embeds', [])
        
        if not content and not embeds:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Empty message, skipped'}),
                'isBase64Encoded': False
            }
        
        message_text = f"🔔 *Новое сообщение из Discord*\n\n"
        message_text += f"👤 *{username}*\n"
        
        if content:
            message_text += f"\n{content}"
        
        if embeds:
            for embed in embeds[:3]:
                if embed.get('title'):
                    message_text += f"\n\n📌 *{embed['title']}*"
                if embed.get('description'):
                    message_text += f"\n{embed['description'][:200]}"
        
        telegram_url = f"https://api.telegram.org/bot{telegram_token}/sendMessage"
        telegram_payload = {
            'chat_id': telegram_chat_id,
            'text': message_text,
            'parse_mode': 'Markdown'
        }
        
        response = requests.post(telegram_url, json=telegram_payload, timeout=10)
        
        if response.status_code == 200:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Message forwarded to Telegram successfully'}),
                'isBase64Encoded': False
            }
        else:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': f'Telegram API error: {response.text}'}),
                'isBase64Encoded': False
            }
    
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid JSON'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

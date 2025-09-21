import json
import random
from typing import Dict, Any
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate real-time website metrics and RPS data for monitoring dashboard
    Args: event - dict with httpMethod, queryStringParameters
          context - object with attributes: request_id, function_name
    Returns: HTTP response with metrics data
    '''
    # Handle CORS OPTIONS request
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    current_time = datetime.now()
    
    # Generate realistic RPS data for last 30 minutes
    data_points = []
    base_rps = random.randint(50, 200)
    
    for i in range(30):
        timestamp = current_time - timedelta(minutes=29-i)
        variance = random.randint(-20, 30)
        spike_chance = random.random()
        
        if spike_chance > 0.95:
            rps_value = base_rps + variance + random.randint(100, 300)
        elif spike_chance < 0.05:
            rps_value = max(1, base_rps + variance - random.randint(30, 80))
        else:
            rps_value = max(1, base_rps + variance)
        
        data_points.append({
            'timestamp': timestamp.isoformat(),
            'value': rps_value,
            'label': timestamp.strftime('%H:%M')
        })
    
    current_metrics = {
        'current_rps': data_points[-1]['value'],
        'avg_rps': sum(point['value'] for point in data_points) // len(data_points),
        'peak_rps': max(point['value'] for point in data_points),
        'total_requests': sum(point['value'] for point in data_points) * 60,
        'uptime': '99.8%',
        'response_time': f"{random.randint(50, 300)}ms",
        'active_users': random.randint(150, 800),
        'error_rate': f"{random.uniform(0.1, 2.5):.1f}%"
    }
    
    response_data = {
        'type': 'rps',
        'data': data_points,
        'metrics': current_metrics,
        'timestamp': current_time.isoformat(),
        'status': 'healthy' if current_metrics['current_rps'] > 10 else 'warning'
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps(response_data)
    }
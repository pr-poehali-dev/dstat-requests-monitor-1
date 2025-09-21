import json
import random
import time
from typing import Dict, Any, List
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate real-time website metrics and RPS data for monitoring dashboard
    Args: event - dict with httpMethod, queryStringParameters
          context - object with attributes: request_id, function_name
    Returns: HTTP response with metrics data
    '''
    # Handle event format variations
    if not event:
        event = {}
    
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
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
    
    if method == 'GET':
        query_params = event.get('queryStringParameters', {}) or {}
        metric_type = query_params.get('type', 'rps')
        
        current_time = datetime.now()
        
        if metric_type == 'rps':
            # Generate realistic RPS data for last 30 minutes
            data_points = []
            base_rps = random.randint(50, 200)
            
            for i in range(30):
                timestamp = current_time - timedelta(minutes=29-i)
                # Add some realistic variance
                variance = random.randint(-20, 30)
                spike_chance = random.random()
                
                if spike_chance > 0.95:  # 5% chance of traffic spike
                    rps_value = base_rps + variance + random.randint(100, 300)
                elif spike_chance < 0.05:  # 5% chance of traffic drop
                    rps_value = max(1, base_rps + variance - random.randint(30, 80))
                else:
                    rps_value = max(1, base_rps + variance)
                
                data_points.append({
                    'timestamp': timestamp.isoformat(),
                    'value': rps_value,
                    'label': timestamp.strftime('%H:%M')
                })
            
            # Current live metrics
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
            
        else:
            # Generate other metric types
            response_data = {
                'type': metric_type,
                'data': [],
                'timestamp': current_time.isoformat(),
                'status': 'healthy'
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
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
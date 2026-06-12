import json
import boto3
import os
from datetime import datetime

dynamodb = boto3.resource('dynamodb')

AUDIT_TABLE = os.environ.get('AUDIT_TABLE', 'UserOnboardingAuditLog')
table = dynamodb.Table(AUDIT_TABLE)

def lambda_handler(event, context):
  """Retrieve audit logs from DynamoDB"""
  try:
    response = table.scan()
    logs = response.get('Items', [])

    # Convert timestamp strings to ISO format for consistent ordering
    logs.sort(key=lambda x: x.get('timestamp', ''), reverse=True)

    return success_response(logs)

  except Exception as e:
    print(f"Error: {str(e)}")
    return error_response(500, f'Server error: {str(e)}')

def success_response(data):
  return {
    'statusCode': 200,
    'headers': {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    'body': json.dumps(data)
  }

def error_response(code, message):
  return {
    'statusCode': code,
    'headers': {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    'body': json.dumps({'error': message})
  }

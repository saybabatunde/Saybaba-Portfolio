import json
import boto3
import os
from datetime import datetime
from uuid import uuid4

iam = boto3.client('iam')
dynamodb = boto3.resource('dynamodb')

AUDIT_TABLE = os.environ.get('AUDIT_TABLE', 'UserOnboardingAuditLog')
table = dynamodb.Table(AUDIT_TABLE)

def lambda_handler(event, context):
    """Create IAM user and log to DynamoDB"""
    try:
        body = json.loads(event.get('body', '{}'))

        name = body.get('name')
        email = body.get('email')
        group = body.get('group', 'developers')

        if not name or not email:
            return error_response(400, 'Name and email required')

        username = email.split('@')[0]
        timestamp = datetime.utcnow().isoformat()
        audit_id = str(uuid4())

        logs = []

        try:
            # Create IAM user
            iam.create_user(UserName=username)
            logs.append({
                'timestamp': datetime.utcnow().isoformat(),
                'action': 'CreateIAMUser',
                'status': 'SUCCESS',
                'details': f'Created IAM user: {username}'
            })
        except iam.exceptions.EntityAlreadyExistsException:
            logs.append({
                'timestamp': datetime.utcnow().isoformat(),
                'action': 'CreateIAMUser',
                'status': 'FAILED',
                'details': f'User {username} already exists'
            })
            return error_response(400, f'User {username} already exists')

        try:
            # Add user to group
            iam.add_user_to_group(GroupName=group, UserName=username)
            logs.append({
                'timestamp': datetime.utcnow().isoformat(),
                'action': 'AddUserToGroup',
                'status': 'SUCCESS',
                'details': f'Added to group: {group}'
            })
        except Exception as e:
            logs.append({
                'timestamp': datetime.utcnow().isoformat(),
                'action': 'AddUserToGroup',
                'status': 'FAILED',
                'details': str(e)
            })

        # Log to DynamoDB
        table.put_item(Item={
            'auditId': audit_id,
            'timestamp': timestamp,
            'action': 'UserCreation',
            'username': username,
            'email': email,
            'fullName': name,
            'group': group,
            'status': 'COMPLETED',
            'logs': logs,
            'ttl': int(datetime.utcnow().timestamp()) + (90 * 24 * 60 * 60)  # 90 days
        })

        return success_response({
            'auditId': audit_id,
            'username': username,
            'email': email,
            'group': group,
            'status': 'COMPLETED',
            'logs': logs
        })

    except Exception as e:
        print(f"Error: {str(e)}")
        return error_response(500, f'Server error: {str(e)}')

def success_response(data):
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data)
    }

def error_response(code, message):
    return {
        'statusCode': code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message})
    }

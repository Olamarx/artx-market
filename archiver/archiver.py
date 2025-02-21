import os
import time
from flask import Flask, jsonify, request
from git import Repo
from git.exc import GitCommandError
from ipfs import *
#from datetime import datetime
from threading import Lock
import authorizer

app = Flask(__name__)
lock = Lock()

try:
    Repo.init('data')
except GitCommandError as error:
    print(f"git error {str(error)}")

repo = Repo('data')

@app.route('/api/v1/ready', methods=['GET'])
def ready():
    auth = authorizer.Authorizer()
    addr = auth.getAddress()

    # Check if checkIpfs() returns True and getAddress() returns a non-empty string
    ready = checkIpfs() and bool(addr.strip())

    return jsonify({'ready': ready})

@app.route('/api/v1/pin/<path:subfolder>', methods=['GET'])
def pin(subfolder):
    try:
        if not subfolder:
            print("Failed to pin data: No path provided")
            return jsonify({'error': 'No path provided'}), 400

        if checkIpfs():
            start = time.time()
            ipfs = getIpfs()
            elapsed = time.time() - start
            print(f"> getIpfs took {elapsed} seconds")

            start = time.time()
            res = ipfs.add(subfolder, recursive=True, pin=True, pattern="**")
            elapsed = time.time() - start
            print(f"> ipfs.add took {elapsed} seconds for {len(res)} items")
            cid = res[-1]['Hash']
        else:
            print("IPFS not available")
            return jsonify({'error': 'IPFS not available'}), 500
    except IPFSError as error:
        print(f"Failed to pin data {subfolder}: {str(error)}")
        return jsonify({'error': f"Failed to pin data: {str(error)}"}), 500
    except Exception as error:
        print(f"An unexpected error occurred: {str(error)}")
        return jsonify({'error': f"An unexpected error occurred: {str(error)}"}), 500

    print(f"pinned {subfolder} to {cid}")
    return jsonify({'path': subfolder, 'cid': cid})

@app.route('/api/v1/commit', methods=['POST'])
def commit():
    data = request.get_json()

    if not data or 'message' not in data:
        return jsonify({'error': 'No message provided'}), 400

    message = data['message']

    with lock:
        try:
            repo.git.add('--all')
            repo.git.commit('-m', message)
            githash = repo.git.rev_parse('HEAD')
            print(f'git commit successful: "{message}"')
        except GitCommandError as error:
            print(f'Failed to commit changes: {str(error)}')
            return jsonify({'error': f'Failed to commit changes: {str(error)}'}), 500

    return jsonify({'ok': 1, 'githash': githash})

@app.route('/api/v1/push', methods=['GET'])
def push():
    with lock:
        try:
            repo.git.push()
            print('git push successful')
        except GitCommandError as error:
            print(f'Failed to push changes: {str(error)}')
            return jsonify({'error': f'Failed to push changes: {str(error)}'}), 500

    return jsonify({'ok': 1})

@app.route('/api/v1/register', methods=['POST'])
def register():
    data = request.get_json()

    if 'xid' not in data:
        return jsonify({'error': 'No xid provided'}), 400

    if 'cid' not in data:
        return jsonify({'error': 'No cid provided'}), 400

    auth = authorizer.Authorizer()
    auth.register = True
    txid = auth.notarize(data['xid'], data['cid'])

    return jsonify({'txid': txid})

@app.route('/api/v1/notarize', methods=['POST'])
def notarize():
    data = request.get_json()

    if 'xid' not in data:
        return jsonify({'error': 'No xid provided'}), 400

    if 'cid' not in data:
        return jsonify({'error': 'No cid provided'}), 400

    auth = authorizer.Authorizer()
    txid = auth.notarize(data['xid'], data['cid'])

    return jsonify({'txid': txid})

@app.route('/api/v1/certify', methods=['POST'])
def certify():
    data = request.get_json()

    if not data or 'txid' not in data:
        return jsonify({'error': 'No txid provided'}), 400

    auth = authorizer.Authorizer()
    cert = auth.certify(data['txid'])

    return jsonify(cert)

@app.route('/api/v1/walletinfo', methods=['GET'])
def walletinfo():
    auth = authorizer.Authorizer()

    start = time.time()
    auth.updateWallet()
    elapsed = time.time() - start
    print(f"> updateWallet took {elapsed} seconds")

    start = time.time()
    walletinfo = auth.getWalletinfo()
    elapsed = time.time() - start
    print(f"> getWalletinfo took {elapsed} seconds")

    start = time.time()
    fee = auth.getFee(3) * 255/1000
    elapsed = time.time() - start
    print(f"> getFee took {elapsed} seconds")

    start = time.time()
    address = auth.getAddress()
    elapsed = time.time() - start
    print(f"> getAddress took {elapsed} seconds")

    info = {
        "wallet": walletinfo,
        "fee": "{:.8f}".format(fee),
        "staked": auth.staked,
        "balance": auth.balance,
        "notarizations": auth.balance//fee,
        "address": address
    }

    return jsonify(info)

if __name__ == '__main__':
    port = int(os.getenv('ARC_PORT', 5115))
    app.run(debug=True, host='0.0.0.0', port=port)

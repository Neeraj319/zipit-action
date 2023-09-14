import argparse
import logging
import subprocess
from subprocess import PIPE
from subprocess import STDOUT
from subprocess import CalledProcessError

import requests
from requests.exceptions import Timeout
from requests.models import HTTPBasicAuth

parser = argparse.ArgumentParser()

logging.basicConfig(level=logging.NOTSET)

import os

parser.add_argument("--zip-file-name", dest="zip_file_name", type=str, required=True)
parser.add_argument("--url", dest="url", type=str, required=True)

parser.add_argument("--username", dest="username", type=str, required=True)
parser.add_argument("--password", dest="password", type=str, required=True)
parser.add_argument(
    "--upload-file-filed-name", dest="upload_file_filed_name", type=str, required=True
)


args = parser.parse_args()
auth = HTTPBasicAuth(username=args.username, password=args.password)


def main():
    try:
        process = subprocess.Popen(
            f"zip {args.zip_file_name} -r /github/workspace/",
            stdout=PIPE,
            stderr=STDOUT,
            shell=True,
        )
        while True:
            line = process.stdout.readline()
            if not line:
                break

    except CalledProcessError as exp:
        stdout = (exp.stdout.decode("utf-8").strip()) + "\n"
        stderr = (exp.stderr.decode("utf-8").strip()) + "\n"
        logging.error(stderr)
        logging.error(stdout)
        return
    except Exception as exp:
        error = str(exp)
        logging.info("Unexpected exception while running process")
        logging.error(error)
        return

    try:
        files = {args.upload_file_filed_name: open(args.zip_file_name, "rb")}
        response = requests.post(auth=auth, url=args.url, timeout=60, files=files)
        if not response.ok:
            logging.error(f"failed with status code {response.status_code}")
            logging.error(f"{response.text}")
            return
        logging.info("Done")
    except Timeout as e:
        logging.info(f"Request timed out {e}")
        return
    except Exception as e:
        logging.error("Unhandled request exception")
        logging.error(e)


main()

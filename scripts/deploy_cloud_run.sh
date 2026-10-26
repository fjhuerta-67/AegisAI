#!/usr/bin/env bash
# Kept for backward compatibility: the deploy script lives at the repository root.
exec "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/deploy_cloud_run.sh" "$@"

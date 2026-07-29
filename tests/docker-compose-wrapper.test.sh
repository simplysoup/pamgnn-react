#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$script_dir/.." && pwd)

workdir=$(mktemp -d)
trap 'rm -rf "$workdir"' EXIT

cat > "$workdir/docker" <<'EOF'
#!/usr/bin/env sh
exit 1
EOF
chmod +x "$workdir/docker"

if PATH="$workdir:$PATH" sh "$repo_root/scripts/docker-compose.sh" version >/tmp/docker-wrapper.out 2>/tmp/docker-wrapper.err; then
  echo 'expected docker wrapper to fail when Docker access is unavailable' >&2
  exit 1
fi

if ! grep -q 'Docker access denied' /tmp/docker-wrapper.err; then
  echo 'expected a clear Docker access error message' >&2
  cat /tmp/docker-wrapper.err >&2
  exit 1
fi

echo 'docker wrapper permission check passed'

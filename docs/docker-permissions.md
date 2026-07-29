# Docker permissions troubleshooting

If Docker Compose commands fail with a permission error on this remote host, the issue is usually that the current user cannot access the Docker daemon socket.

Common fix:

```bash
sudo groupadd docker 2>/dev/null || true
sudo usermod -aG docker "$USER"
newgrp docker
```

Then verify:

```bash
docker ps
```

If the daemon is running but access is still denied, restart the Docker service or re-login to the remote session.

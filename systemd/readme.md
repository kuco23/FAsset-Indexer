# Run agent as a `systemd` Service

All the examples are for the `fasset-indexer` service.


1. Copy the `.service` files for services you want to run to `/etc/systemd/system`.

1. Replace the necessary values in the `.service` file.

1. Run `sudo systemctl daemon-reload`, so that the system detects new services.

1. Now you can start (or stop) services by executing:

   ```console
   sudo systemctl start fasset-indexer-core
   ```

1. To make services start automatically at boot time, execute:

   ```console
   sudo systemctl enable fasset-indexer-core
   ```

1. To view the console output, use command:

   ```console
   sudo journalctl -fu fasset-indexer-core.service
   ```

    This will follow the output.
    To show the past output in `less`, call instead

   ```console
   sudo journalctl -eu fasset-indexer-core.service
   ```

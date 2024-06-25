
import chokidar from 'chokidar';
import path from 'path';
import { clientSideRootDir } from '../consts.js'

export class FileWatchWrapper {
  wss;

  constructor(wss) {
    this.wss = wss;
  }

  prepareHmrEvent(fileMonitorEvent, filePath) {
    const event = {
      type: 'update', payload: { fileMonitorEvent, filePath }
    }
    console.log({ event })

    return event;
  }

  trackClientChanges() {
    const watchFolder = chokidar.watch([
      `**/*.html`,
      `**/*.css`,
      `**/*.js`
    ],{
      cwd: clientSideRootDir,
    });

    watchFolder.on('ready', () => {
      watchFolder.on('all', (monitorEvent, filePath) => {
        const relativePath = path.relative(clientSideRootDir, filePath);
        const hmrEvent = this.prepareHmrEvent(monitorEvent, relativePath);

        this.wss.broadcast(hmrEvent)
      });
    });
  }
}
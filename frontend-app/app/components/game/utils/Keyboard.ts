import { Map } from '../logic/Map';
import { Player } from '../logic/Player';

export const handleKeyboardInput = (event: KeyboardEvent, map: Map, player: Player) => {
  switch(event.key) {
      case 'ArrowLeft':
          player.moveLeft(map);
          break;
      case 'ArrowRight':
          player.moveRight(map);
          break;
      case 'ArrowUp':
          player.moveUp(map);
          break;
      case 'ArrowDown':
          player.moveDown(map);
          break;
  }
}

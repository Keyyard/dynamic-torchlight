import { BlockPermutation, Container, ItemStack, Player } from "@minecraft/server";

export function replaceItems(inventory: Container, oldTypeId: string, newTypeId: string) {
  for (let i = 0; i < inventory.size; i++) {
    const item = inventory.getItem(i);
    if (item && item.typeId === oldTypeId) {
      const newItem = new ItemStack(newTypeId, item.amount);
      newItem.setLore([`§6placeable in offhand slot!`]);
      inventory.setItem(i, newItem);
    }
  }
}

export function removeLightBlocks(dimension: any, x: number, y: number, z: number) {
  const radius = 4;
  const height = 2;
  const airBlock = BlockPermutation.resolve("minecraft:air");
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -height; dy <= height; dy++) {
      for (let dz = -radius; dz <= radius; dz++) {
        if (dx === 0 && dy === 1 && dz === 0) continue;
        const block = dimension.getBlock({ x: x + dx, y: y + dy, z: z + dz });
        if (
          block &&
          ["minecraft:light_block_13", "minecraft:light_block_11", "minecraft:light_block_9"].includes(block.typeId)
        ) {
          block.setPermutation(airBlock);
        }
      }
    }
  }
}

export function setLightLevel(player: Player, level: number | null) {
  const dimension = player.dimension;
  const { x, y, z } = player.location;

  if (level !== null) {
    const centerBlock = dimension.getBlock({ x, y: y + 1, z });
    if (centerBlock) {
      const lightBlock = BlockPermutation.resolve("minecraft:light_block", { block_light_level: level });
      centerBlock.setPermutation(lightBlock);
    }
  }

  removeLightBlocks(dimension, x, y, z);
}

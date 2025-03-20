import {
  Container,
  EntityEquippableComponent,
  EntityInventoryComponent,
  EquipmentSlot,
  ItemStack,
  system,
  world,
  Player,
  BlockPermutation
} from "@minecraft/server";

class LightManager {
  async light13(player:Player) {
    let dimension = player.dimension;
    let { x, y, z } = player.location;

    // Place the central light block
    const centerBlock = dimension.getBlock({ x, y: y + 1, z });
    if (centerBlock) {
        let lightBlock = BlockPermutation.resolve("minecraft:light_block", { block_light_level: 13 });
        centerBlock.setPermutation(lightBlock);
    }

    // Remove only light blocks in the correct area
    const radius = 4;
    const height = 2;
    let airBlock = BlockPermutation.resolve("minecraft:air");

    for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -height; dy <= height; dy++) {
            for (let dz = -radius; dz <= radius; dz++) {
                if (dx === 0 && dy === 1 && dz === 0) continue;

                const block = dimension.getBlock({ x: x + dx, y: y + dy, z: z + dz });

                if (block && ["minecraft:light_block_13","minecraft:light_block_11","minecraft:light_block_9"].includes(block.typeId)) {
                    block.setPermutation(airBlock);
                }
            }
        }
    }
  }
  async light11(player: Player) {
    let dimension = player.dimension;
    let { x, y, z } = player.location;

    // Place the central light block
    const centerBlock = dimension.getBlock({ x, y: y + 1, z });
    if (centerBlock) {
        let lightBlock = BlockPermutation.resolve("minecraft:light_block", { block_light_level: 11 });
        centerBlock.setPermutation(lightBlock);
    }

    // Remove only light blocks in the correct area
    const radius = 4;
    const height = 2;
    let airBlock = BlockPermutation.resolve("minecraft:air");

    for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -height; dy <= height; dy++) {
            for (let dz = -radius; dz <= radius; dz++) {
                if (dx === 0 && dy === 1 && dz === 0) continue;

                const block = dimension.getBlock({ x: x + dx, y: y + dy, z: z + dz });

                if (block && ["minecraft:light_block_13","minecraft:light_block_11","minecraft:light_block_9"].includes(block.typeId)) {
                    block.setPermutation(airBlock);
                }
            }
        }
    }
  }
  async light9(player: Player) {
    let dimension = player.dimension;
    let { x, y, z } = player.location;

    // Place the central light block
    const centerBlock = dimension.getBlock({ x, y: y + 1, z });
    if (centerBlock) {
        let lightBlock = BlockPermutation.resolve("minecraft:light_block", { block_light_level: 9 });
        centerBlock.setPermutation(lightBlock);
    }

    // Remove only light blocks in the correct area
    const radius = 4;
    const height = 2;
    let airBlock = BlockPermutation.resolve("minecraft:air");

    for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -height; dy <= height; dy++) {
            for (let dz = -radius; dz <= radius; dz++) {
                if (dx === 0 && dy === 1 && dz === 0) continue;

                const block = dimension.getBlock({ x: x + dx, y: y + dy, z: z + dz });

                if (block && ["minecraft:light_block_13","minecraft:light_block_11","minecraft:light_block_9"].includes(block.typeId)) {
                    block.setPermutation(airBlock);
                }
            }
        }
    }
  }
  async no_light(player: Player) {
    let dimension = player.dimension;
    let { x, y, z } = player.location;
    const radius = 4;
    const height = 2;
    let airBlock = BlockPermutation.resolve("minecraft:air");

    for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -height; dy <= height; dy++) {
            for (let dz = -radius; dz <= radius; dz++) {
                const block = dimension.getBlock({ x: x + dx, y: y + dy, z: z + dz });

                if (block && ["minecraft:light_block_13","minecraft:light_block_11","minecraft:light_block_9"].includes(block.typeId)) {
                    block.setPermutation(airBlock);
                }
            }
        }
    }
  }
}

class TorchlightManager {
  private light13 = ["torch_offhand", "minecraft:torch"];
  private light11 = ["soul_torch", "soul_torch_offhand"];
  private light9 = ["redstone_torch", "redstone_torch_offhand"];

  LightManagerInstance = new LightManager();
  constructor() {
    system.runInterval(() => this.updatePlayers());
  }

  private replaceItems(inventory: Container, oldTypeId: string, newTypeId: string) {
    for (let i = 0; i < inventory.size; i++) {
      const item = inventory.getItem(i);
      if (item && item.typeId === oldTypeId) {
        const newItem = new ItemStack(newTypeId, item.amount);
        newItem.setLore([`§6placeable in offhand slot!`]);
        inventory.setItem(i, newItem);
      }
    }
  }

  private updatePlayers() {
    const players = world.getPlayers();
    players.forEach((player) => this.updatePlayer(player));
  }

  private updatePlayer(player: Player) {
    const inventory = player.getComponent("minecraft:inventory") as EntityInventoryComponent;
    if (!inventory) return;

    const container = inventory.container;
    if (container) {
      this.replaceItems(container, "minecraft:torch", "keyyard:torch_offhand");
      this.replaceItems(container, "minecraft:redstone_torch", "keyyard:redstone_torch_offhand");
      this.replaceItems(container, "minecraft:soul_torch", "keyyard:soul_torch_offhand");
    }

    const equip = player.getComponent(EntityEquippableComponent.componentId) as EntityEquippableComponent;
    const hand = equip?.getEquipment(EquipmentSlot.Mainhand);
    const offhand = equip?.getEquipment(EquipmentSlot.Offhand);

    this.updateHand(player, hand);
    this.updateOffhand(player, offhand);
  }

  private updateHand(player: Player, hand: any) {
    if (!hand && !player.hasTag("offhand")) {
      player.removeTag("mainhand");
      this.LightManagerInstance.no_light(player);
    }

    if (hand && !player.hasTag("offhand")) {
      this.light13.forEach((i) => {
        if (hand.typeId.includes(i)) {
          player.addTag("mainhand");
          this.LightManagerInstance.light13(player);
        }
      });
      this.light11.forEach((i) => {
        if (hand.typeId.includes(i)) {
          player.addTag("mainhand");
          this.LightManagerInstance.light11(player);
        }
      });
      this.light9.forEach((i) => {
        if (hand.typeId.includes(i)) {
          player.addTag("mainhand");
          this.LightManagerInstance.light9(player);
        }
      });
    }
  }

  private updateOffhand(player: Player, offhand: any) {
    if (!offhand) {
      player.removeTag("offhand");
      if (!player.hasTag("mainhand")) {
        this.LightManagerInstance.no_light(player);
      }
    } else {
      if (offhand.typeId.includes("torch_offhand")) {
        player.addTag("offhand");
        this.LightManagerInstance.light13(player);
      }
      if (offhand.typeId.includes("soul_torch_offhand")) {
        player.addTag("offhand");
        this.LightManagerInstance.light11(player);
      }
      if (offhand.typeId.includes("redstone_torch_offhand")) {
        player.addTag("offhand");
        this.LightManagerInstance.light9(player);
      }
    }
  }
}

new TorchlightManager();

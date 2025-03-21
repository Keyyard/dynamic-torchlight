// scripts/main.ts
import {
  EntityEquippableComponent,
  EquipmentSlot,
  ItemStack,
  system,
  world,
  BlockPermutation
} from "@minecraft/server";
var LightManager = class {
  async setLightLevel(player, level) {
    let dimension = player.dimension;
    let { x, y, z } = player.location;
    const radius = 4;
    const height = 2;
    let airBlock = BlockPermutation.resolve("minecraft:air");
    if (level !== null) {
      const centerBlock = dimension.getBlock({ x, y: y + 1, z });
      if (centerBlock) {
        const lightBlock = BlockPermutation.resolve("minecraft:light_block", { block_light_level: level });
        centerBlock.setPermutation(lightBlock);
      }
    }
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -height; dy <= height; dy++) {
        for (let dz = -radius; dz <= radius; dz++) {
          if (dx === 0 && dy === 1 && dz === 0)
            continue;
          const block = dimension.getBlock({ x: x + dx, y: y + dy, z: z + dz });
          if (block && ["minecraft:light_block_13", "minecraft:light_block_11", "minecraft:light_block_9"].includes(block.typeId)) {
            block.setPermutation(airBlock);
          }
        }
      }
    }
  }
  async light13(player) {
    await this.setLightLevel(player, 13);
  }
  async light11(player) {
    await this.setLightLevel(player, 11);
  }
  async light9(player) {
    await this.setLightLevel(player, 9);
  }
  async no_light(player) {
    let { x, y, z } = player.location;
    let airBlock = BlockPermutation.resolve("minecraft:air");
    let dimension = player.dimension;
    const radius = 4;
    const height = 2;
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -height; dy <= height; dy++) {
        for (let dz = -radius; dz <= radius; dz++) {
          const block = dimension.getBlock({ x: x + dx, y: y + dy, z: z + dz });
          if (block && ["minecraft:light_block_13", "minecraft:light_block_11", "minecraft:light_block_9"].includes(block.typeId)) {
            block.setPermutation(airBlock);
          }
        }
      }
    }
  }
};
var TorchlightManager = class {
  constructor() {
    this.light13 = ["torch_offhand", "minecraft:torch"];
    this.light11 = ["soul_torch", "soul_torch_offhand"];
    this.light9 = ["redstone_torch", "redstone_torch_offhand"];
    this.LightManagerInstance = new LightManager();
    system.runInterval(() => this.updatePlayers());
  }
  replaceItems(inventory, oldTypeId, newTypeId) {
    for (let i = 0; i < inventory.size; i++) {
      const item = inventory.getItem(i);
      if (item && item.typeId === oldTypeId) {
        const newItem = new ItemStack(newTypeId, item.amount);
        newItem.setLore([`\xA76placeable in offhand slot!`]);
        inventory.setItem(i, newItem);
      }
    }
  }
  updatePlayers() {
    const players = world.getPlayers();
    players.forEach((player) => this.updatePlayer(player));
  }
  updatePlayer(player) {
    const inventory = player.getComponent("minecraft:inventory");
    if (!inventory)
      return;
    const container = inventory.container;
    if (container) {
      this.replaceItems(container, "minecraft:torch", "keyyard:torch_offhand");
      this.replaceItems(container, "minecraft:redstone_torch", "keyyard:redstone_torch_offhand");
      this.replaceItems(container, "minecraft:soul_torch", "keyyard:soul_torch_offhand");
    }
    const equip = player.getComponent(EntityEquippableComponent.componentId);
    const hand = equip?.getEquipment(EquipmentSlot.Mainhand);
    const offhand = equip?.getEquipment(EquipmentSlot.Offhand);
    this.updateHand(player, hand);
    this.updateOffhand(player, offhand);
  }
  updateHand(player, hand) {
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
  updateOffhand(player, offhand) {
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
};
new TorchlightManager();

//# sourceMappingURL=../debug/main.js.map

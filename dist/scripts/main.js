// scripts/main.ts
import {
  EntityEquippableComponent,
  EquipmentSlot,
  ItemStack,
  system,
  world
} from "@minecraft/server";
var LightManager = class {
  async light13(player) {
    player.runCommandAsync(`setblock ~ ~1 ~ light_block ["block_light_level"=13]`);
    player.runCommandAsync(`fill ~4 ~2 ~4 ~-4 ~4 ~-4 air [] replace light_block ["block_light_level"=13]`);
    player.runCommandAsync(`fill ~4 ~-1 ~4 ~-4 ~-2 ~-4 air [] replace light_block ["block_light_level"=13]`);
    player.runCommandAsync(`fill ~4 ~2 ~4 ~1 ~ ~1 air [] replace light_block ["block_light_level"=13]`);
    player.runCommandAsync(`fill ~-4 ~2 ~-4 ~-1 ~ ~-1 air [] replace light_block ["block_light_level"=13]`);
    player.runCommandAsync(`fill ~4 ~2 ~-4 ~1 ~ ~-1 air [] replace light_block ["block_light_level"=13]`);
    player.runCommandAsync(`fill ~-4 ~2 ~4 ~-1 ~ ~1 air [] replace light_block ["block_light_level"=13]`);
    player.runCommandAsync(`fill ~-4 ~2 ~ ~-1 ~ ~ air [] replace light_block ["block_light_level"=13]`);
    player.runCommandAsync(`fill ~4 ~2 ~ ~1 ~ ~ air [] replace light_block ["block_light_level"=13]`);
    player.runCommandAsync(`fill ~ ~2 ~-4 ~ ~ ~-1 air [] replace light_block ["block_light_level"=13]`);
    player.runCommandAsync(`fill ~ ~2 ~4 ~ ~ ~1 air [] replace light_block ["block_light_level"=13]`);
  }
  async light11(player) {
    player.runCommandAsync(`setblock ~ ~1 ~ light_block ["block_light_level"=11]`);
    player.runCommandAsync(`fill ~4 ~2 ~4 ~-4 ~4 ~-4 air [] replace light_block ["block_light_level"=11]`);
    player.runCommandAsync(`fill ~4 ~-1 ~4 ~-4 ~-2 ~-4 air [] replace light_block ["block_light_level"=11]`);
    player.runCommandAsync(`fill ~4 ~2 ~4 ~1 ~ ~1 air [] replace light_block ["block_light_level"=11]`);
    player.runCommandAsync(`fill ~-4 ~2 ~-4 ~-1 ~ ~-1 air [] replace light_block ["block_light_level"=11]`);
    player.runCommandAsync(`fill ~4 ~2 ~-4 ~1 ~ ~-1 air [] replace light_block ["block_light_level"=11]`);
    player.runCommandAsync(`fill ~-4 ~2 ~4 ~-1 ~ ~1 air [] replace light_block ["block_light_level"=11]`);
    player.runCommandAsync(`fill ~-4 ~2 ~ ~-1 ~ ~ air [] replace light_block ["block_light_level"=11]`);
    player.runCommandAsync(`fill ~4 ~2 ~ ~1 ~ ~ air [] replace light_block ["block_light_level"=11]`);
    player.runCommandAsync(`fill ~ ~2 ~-4 ~ ~ ~-1 air [] replace light_block ["block_light_level"=11]`);
    player.runCommandAsync(`fill ~ ~2 ~4 ~ ~ ~1 air [] replace light_block ["block_light_level"=11]`);
  }
  async light9(player) {
    player.runCommandAsync(`setblock ~ ~1 ~ light_block ["block_light_level"=9]`);
    player.runCommandAsync(`fill ~4 ~2 ~4 ~-4 ~4 ~-4 air [] replace light_block ["block_light_level"=9]`);
    player.runCommandAsync(`fill ~4 ~-1 ~4 ~-4 ~-2 ~-4 air [] replace light_block ["block_light_level"=9]`);
    player.runCommandAsync(`fill ~4 ~2 ~4 ~1 ~ ~1 air [] replace light_block ["block_light_level"=9]`);
    player.runCommandAsync(`fill ~-4 ~2 ~-4 ~-1 ~ ~-1 air [] replace light_block ["block_light_level"=9]`);
    player.runCommandAsync(`fill ~4 ~2 ~-4 ~1 ~ ~-1 air [] replace light_block ["block_light_level"=9]`);
    player.runCommandAsync(`fill ~-4 ~2 ~4 ~-1 ~ ~1 air [] replace light_block ["block_light_level"=9]`);
    player.runCommandAsync(`fill ~-4 ~2 ~ ~-1 ~ ~ air [] replace light_block ["block_light_level"=9]`);
    player.runCommandAsync(`fill ~4 ~2 ~ ~1 ~ ~ air [] replace light_block ["block_light_level"=9]`);
    player.runCommandAsync(`fill ~ ~2 ~-4 ~ ~ ~-1 air [] replace light_block ["block_light_level"=9]`);
    player.runCommandAsync(`fill ~ ~2 ~4 ~ ~ ~1 air [] replace light_block ["block_light_level"=9]`);
  }
  async no_light(player) {
    player.runCommandAsync(`fill ~4 ~2 ~4 ~-4 ~4 ~-4 air [] replace light_block`);
    player.runCommandAsync(`fill ~4 ~-1 ~4 ~-4 ~-2 ~-4 air [] replace light_block`);
    player.runCommandAsync(`fill ~4 ~2 ~4 ~1 ~ ~1 air [] replace light_block`);
    player.runCommandAsync(`fill ~-4 ~2 ~-4 ~-1 ~ ~-1 air [] replace light_block`);
    player.runCommandAsync(`fill ~4 ~2 ~-4 ~1 ~ ~-1 air [] replace light_block`);
    player.runCommandAsync(`fill ~-4 ~2 ~4 ~-1 ~ ~1 air [] replace light_block`);
    player.runCommandAsync(`fill ~-4 ~2 ~ ~-1 ~ ~ air [] replace light_block`);
    player.runCommandAsync(`fill ~4 ~2 ~ ~1 ~ ~ air [] replace light_block`);
    player.runCommandAsync(`fill ~ ~2 ~-4 ~ ~ ~-1 air [] replace light_block`);
    player.runCommandAsync(`fill ~ ~2 ~4 ~ ~ ~1 air [] replace light_block`);
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

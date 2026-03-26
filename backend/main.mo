import Random "mo:core/Random";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Migration "migration";

(with migration = Migration.run)
actor {
  type ColorScheme = {
    primary : Text;
    secondary : Text;
    accent : Text;
  };

  type GlowEffect = {
    intensity : Nat;
    color : Text;
  };

  type AnimationParams = {
    speed : Nat;
    type_ : Text;
  };

  type PandaCard = {
    id : Nat;
    colorScheme : ColorScheme;
    glowEffect : GlowEffect;
    animationParams : AnimationParams;
    rarity : Text;
  };

  var initialized = false;

  // Static data for 100 unique panda cards
  var pandaCards : [PandaCard] = [];

  func initializeCards() {
    if (initialized) { Runtime.trap("Cards already initialized") };

    let baseColorSchemes : [ColorScheme] = [
      { primary = "#f4f4f4"; secondary = "#000000"; accent = "#00ffcc" },
      { primary = "#fff8dc"; secondary = "#8b4513"; accent = "#ffd700" },
      { primary = "#e0e0e0"; secondary = "#006400"; accent = "#ff69b4" },
      { primary = "#f5f5f5"; secondary = "#483d8b"; accent = "#ff4500" },
      { primary = "#fafafa"; secondary = "#2e8b57"; accent = "#1e90ff" },
      { primary = "#ececec"; secondary = "#8b008b"; accent = "#adff2f" }
    ];

    let baseGlowEffects : [GlowEffect] = [
      { intensity = 15; color = "#00ffcc" },
      { intensity = 20; color = "#ffd700" },
      { intensity = 18; color = "#ff69b4" },
      { intensity = 16; color = "#ff4500" },
      { intensity = 22; color = "#1e90ff" },
      { intensity = 25; color = "#adff2f" }
    ];

    let baseAnimationTypes : [Text] = ["bounce", "spin", "wave", "pulse"];

    let rarities : [Text] = [
      "Common", "Uncommon", "Rare", "Epic", "Legendary"
    ];

    let cards = Array.tabulate(
      100,
      func(i) {
        {
          id = i + 1;
          colorScheme = baseColorSchemes[i % baseColorSchemes.size()];
          glowEffect = baseGlowEffects[i % baseGlowEffects.size()];
          animationParams = {
            speed = 5 + (i % 10);
            type_ = baseAnimationTypes[i % baseAnimationTypes.size()];
          };
          rarity = rarities[i % 5];
        };
      },
    );
    pandaCards := cards;
    initialized := true;
  };

  // Returns all panda cards
  public query ({ caller }) func getAllCards() : async [PandaCard] {
    if (pandaCards.isEmpty()) { Runtime.trap("Panda cards not initialized") };
    pandaCards;
  };

  // Returns a random panda card
  public shared ({ caller }) func getRandomCard() : async PandaCard {
    if (pandaCards.isEmpty()) { Runtime.trap("Panda cards not initialized") };

    let random = Random.crypto();
    let randomIndex = await* random.natRange(0, pandaCards.size());

    if (randomIndex >= pandaCards.size()) {
      Runtime.trap("Random index out of bounds");
    };

    pandaCards[randomIndex];
  };

  // Returns a specific card by id
  public query ({ caller }) func getCardById(id : Nat) : async PandaCard {
    if (pandaCards.isEmpty()) { Runtime.trap("Panda cards not initialized") };
    if (id >= pandaCards.size() or id == 0) {
      Runtime.trap("Card not found");
    };
    pandaCards[id - 1];
  };

  // Returns the base color schemes effect intensity
  public shared ({ caller }) func getBaseGlowEffectIntensity() : async Nat {
    if (pandaCards.isEmpty()) { Runtime.trap("Panda cards not initialized") };
    pandaCards[0].glowEffect.intensity;
  };

  // Returns the number of cards
  public shared ({ caller }) func getCardCount() : async Nat {
    pandaCards.size();
  };

  // Get all cards of a particular rarity
  public query ({ caller }) func getCardsByRarity(rarity : Text) : async [PandaCard] {
    if (pandaCards.isEmpty()) { Runtime.trap("Panda cards not initialized") };
    pandaCards.filter(
      func(card) {
        card.rarity == rarity;
      }
    );
  };

  // Initialize cards if requested right after deployment
  public shared ({ caller }) func initialize() : async () {
    initializeCards();
  };
};

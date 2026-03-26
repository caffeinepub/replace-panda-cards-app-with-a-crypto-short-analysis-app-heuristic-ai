module {
  type OldActor = { var initialized : Bool };
  type NewActor = { var initialized : Bool };

  public func run(old : OldActor) : NewActor {
    { var initialized = old.initialized };
  };
};

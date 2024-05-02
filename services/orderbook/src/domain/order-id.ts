export class OrderId {
  private static previous = 0;

  public static generate(): number {
    const date = Date.now();
    let generated = date * 100;

    if (generated <= OrderId.previous) {
      generated = ++OrderId.previous;
    } else {
      OrderId.previous = generated;
    }

    return generated;
  }
}

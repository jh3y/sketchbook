const injectStyles = styles => document.querySelector('#escape-hatch').innerHTML = styles

injectStyles(`
  @position-fallback --top-to-bottom {
    @try {
      bottom: anchor(--anchor top);
      left: anchor(--anchor right);
    }
    @try {
      top: anchor(--anchor bottom);
      left: anchor(--anchor right);
    }
  }
`)
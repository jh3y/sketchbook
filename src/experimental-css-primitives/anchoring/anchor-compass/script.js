const injectStyles = styles => document.head.append(Object.assign(document.createElement('style'), {
  innerHTML: styles
}))


injectStyles(`
  @position-fallback --compass {
    @try {
      bottom: anchor(--anchor top);
      right: anchor(--anchor left);
    }
    @try {
      bottom: anchor(--anchor top);
      left: anchor(--anchor right);
    }
    @try {
      top: anchor(--anchor bottom);
      right: anchor(--anchor left);
    }
    @try {
      top: anchor(--anchor bottom);
      left: anchor(--anchor right);
    }
  }
`)
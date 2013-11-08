
# redact-popover

  medium inspired editor popover

## Installation

  Install with [component(1)](http://component.io):

    $ component install yields/redact-popover

## API

### RedactPopover

  Initialize `RedactPopover` with contenteditable `el`.

#### #add

  Add action `id` with optional `label`.
  the id will be the element class.

#### #remove

  Remove action `id`.

#### #get

  Get action `id`.

#### #refresh

  this method is called whenever you `add()` or `remove()`
  an option in order to cache the `<popover>` size.

  if you do something that will change the size (like hide individual actions) call this method.

#### .tip

  [`component/tip`](/component/tip) instance.

#### .classes

  [`component/classes`] instance.

#### .events

  [`component/events`] instance.

## License

  MIT

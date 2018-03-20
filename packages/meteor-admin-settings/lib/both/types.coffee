@AdminSettingsTypes =
  string:
    value:
      type: String
   textarea:
    value:
      type: String
      autoform:
        afFieldInput:
          type: 'textarea'
  number:
    value:
      type: Number
  boolean:
    value:
      type: Boolean
      autoform:
        afFieldInput:
          type: 'boolean-select'
  date:
    value:
      type: Date
      autoform:
        afFieldInput:
          type: 'date'
  color:
    value:
      type: String
      autoform:
        afFieldInput:
          type: 'color'
  password:
    value:
      type: String
      autoform:
        afFieldInput:
          type: 'password'

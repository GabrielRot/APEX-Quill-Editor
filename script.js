let apexQuillInit = (options) => {
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
  ];

  const hiddenField = $(`#${ options.itemName }_HIDDEN`);

  let originalValue;
  let newValue;
  let isDisabled = false;

  if (!options && !options.itemName) {
    console.error('Erro ao inicializar os valores do editor. Por favor, verifique ou entre em contato com o administrador');

    return;
  }

  if (!options.theme) {
    console.error('Erro ao carregar tema. Verifique ou entre e contato com o administrador');

    return;
  }

  function createQuill() {
    /************** Sintaxes de códigos que receberão Highlight **************/
    hljs.configure({
      languages: ['javascript', 'sql', 'python']
    });

    const quill = new Quill(`#${ options.itemName }`, {
      modules: {
        syntax: true,
        toolbar: toolbarOptions,
        imageResize: {
          handleStyles: { // Quinas de resize
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '50%',
            color: 'rgba(0, 0, 0, 0.8)',
          },
          displayStyles: { // Texto da altura e largura da imagem
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '12px',
            color: '#FFF',
          }
        }
      },
      // formats: ['bold', 'italic', 'underline', 'strike', 'formula', 'code-block'],
      placeholder: options.placeHolder,
      theme: options.theme
    });

    if (hiddenField.val()) {
      quill.root.innerHTML = hiddenField.val();
    }

    originalValue = quill.root.innerHTML;
    newValue      = originalValue;

    quill.on('text-change', () => {
      hiddenField.val(quill.root.innerHTML);
      newValue = quill.root.innerHTML;
    });

    apex.item.create(options.itemName, {
      setValue: function(value) {
        quill.root.innerHTML = value;
      },

      getValue: function() {
        return quill.root.innerHTML;
      },

      setFocus: function() {
        quill.focus();
      },

      isChanged: function() {

        return (originalValue != newValue);
      },

      disable: function() {
        $(`#${ options.itemName }_CONTAINER`).addClass('apex_disabled');
        quill.enable(false);

        isDisabled = true;
      },

      isDisabled: function() {
        return isDisabled;
      },

      enable: function() {
        $(`#${ options.itemName }_CONTAINER`).removeClass('apex_disabled');
        quill.enable(true);

        isDisabled = false;
      },

      hide: function() {
        $(`#${ options.itemName }_CONTAINER`).hide();
      },

      show: function() {
        $(`#${ options.itemName }_CONTAINER`).show();
      }
    });
  }

  createQuill();  

  apex.jQuery(document).on('apexbeforesubmit', function() {
    hiddenField.val(quill.root.innerHTML);
  });
}
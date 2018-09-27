document.addEventListener('DOMContentLoaded', function(event) {
  const Share = require('core-fb-ogshares'),
    form = window.document.querySelector('form.box'),
    tableWrapper = window.document.getElementById('table-wrapper');

  if ('box-input' === form.getAttribute('id')) {
    const elSelectApp = window.document.getElementById('select-app');
    if (elSelectApp) {
      elSelectApp.addEventListener('change', () => {
        if (tableWrapper.childNodes && tableWrapper.childNodes.length) {
          const btn = window.document.getElementById('sumbit');
          btn.click();
        }
      });
    }

    form.addEventListener('submit', event => {
      event.preventDefault();

      const me = event.target,
        loading = createLoadingBall(tableWrapper);

      let formData = serialize(me, true),
        apps = [];

      try {
        apps = require('..../../../post-app.json');
      } catch (error) {
        console.error(error);
        return;
      }


      removeAllTable();
      const data = apps[parseInt(formData.app, 10)];

      if (!data) {
        alert('Aplikasi belum dipilih!');
        return;
      }

      try {
        const share = new Share(data.appId, data.url);

        const url = share.build({
          'url': formData.url ? formData.url : '',
          'image': formData.image ? formData.image : '',
          'title': formData.title,
          'description': formData.description
        });

        const table = createTable([
          {
            'title': data.title,
            'url': url
          }
        ]);
        tableWrapper.appendChild(table);
      } catch (error) {
        console.error(error);
        if ('Parameter URL is required' === error.message) {
          alert('URL Wajib di isi!');
        }
        else if ('Parameter image is required' === error.message) {
          alert('Image Wajib di isi!');
        }
        else {
          alert(error.message);
        }
      }
      tableWrapper.removeChild(loading);
    }, false);
  }
});

function serialize(form, toObject) {
  if (!form || form.nodeName !== 'FORM') {
    return;
  }
  let i, j, query = [];
  for (i = form.elements.length - 1; i >= 0; i = i - 1) {
    if (form.elements[i].name === '') {
      continue;
    }
    switch (form.elements[i].nodeName) {
    case 'INPUT':
      switch (form.elements[i].type) {
      case 'text':
      case 'email':
      case 'url':
      case 'hidden':
      case 'password':
      case 'button':
      case 'reset':
      case 'submit':
        query.push({
          name: form.elements[i].name,
          value: form.elements[i].value
        });
        break;
      case 'checkbox':
      case 'radio':
        if (form.elements[i].checked) {
          query.push({
            name: form.elements[i].name,
            value: form.elements[i].value
          });
        }
        break;
      }
      break;
      case 'file':
      break;
    case 'TEXTAREA':
      query.push({
        name: form.elements[i].name,
        value: form.elements[i].value
      });
      break;
    case 'SELECT':
      switch (form.elements[i].type) {
      case 'select-one':
        query.push({
          name: form.elements[i].name,
          value: form.elements[i].value
        });
        break;
      case 'select-multiple':
        for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
          if (form.elements[i].options[j].selected) {
            query.push({
              name: form.elements[i].name,
              value: form.elements[i].options[j].value
            });
          }
        }
        break;
      }
      break;
    case 'BUTTON':
      switch (form.elements[i].type) {
      case 'reset':
      case 'submit':
      case 'button':
        query.push({
          name: form.elements[i].name,
          value: form.elements[i].value
        });
        break;
      }
      break;
    }
  }

  if (true === toObject) {
    const fixed = {};
    let i = 0;
    for (i = 0; i < query.length; ++i) {
      fixed[query[i].name] = query[i].value;
    }
    return fixed;
  }

  return query;
}

function removeAllTable() {
  const table = window.document.querySelectorAll('.table');
  let i = 0;
  for ( ; i < table.length; i++) {
    if (table[i]) {
      table[i].parentNode.removeChild(table[i]);
    }
  }
}

function createTable(dataRows) {
  const table = window.document.createElement('table'),
    tableHeader = window.document.createElement('thead'),
    tableBody = window.document.createElement('tbody'),
    tableRows = window.document.createElement('tr'),
    tableHead = window.document.createElement('th'),
    tableData = window.document.createElement('td'),
    tableRowHead = tableRows.cloneNode(true),
    tableHeadName = tableHead.cloneNode(true),
    tableHeadLink = tableHead.cloneNode(true);

  table.setAttribute('class', 'table');
  tableHeadName.appendChild(window.document.createTextNode('Name'));
  tableHeadLink.appendChild(window.document.createTextNode('Link'));
  tableHeadName.setAttribute('class', 'row-name');
  tableRowHead.appendChild(tableHeadName);
  tableRowHead.appendChild(tableHeadLink);
  tableHeader.appendChild(tableRowHead);
  table.appendChild(tableHeader);

  let i = 0;
  for ( ; i < dataRows.length; i++ ) {
    const tableRow = tableRows.cloneNode(true),
      tableRowDataName = tableData.cloneNode(true),
      tableRowDataLink = tableData.cloneNode(true),
      tableRowDataLinkInput = window.document.createElement('input'),
      tableRowDataLinkLabel = window.document.createElement('span'),
      tableRowDataLinkLabelIcon = window.document.createElement('i');

    tableRowDataName.appendChild(window.document.createTextNode(dataRows[i]['title']));
    tableRowDataLink.setAttribute('class', 'input-control label');
    tableRowDataLinkInput.setAttribute('type', 'text');
    tableRowDataLinkInput.setAttribute('value', dataRows[i]['url']);
    tableRowDataLinkInput.setAttribute('readonly', 'readonly');
    tableRowDataLinkLabel.setAttribute('class', 'label');
    tableRowDataLinkLabelIcon.setAttribute('class', 'fa fa-clipboard');

    if (tableRowDataLinkInput.value && tableRowDataLinkInput.value.trim().length !== 0) {
      const copyMe = () => {
        setTimeout(() => {
          tableRowDataLinkInput.select();
          window.document.execCommand('copy');
        }, 50);
      };

      tableRowDataLinkInput.addEventListener('focus', copyMe);
      tableRowDataLinkLabel.addEventListener('click', copyMe);
    }

    tableRowDataLinkLabel.appendChild(tableRowDataLinkLabelIcon);
    // tableRowDataLinkLabel.appendChild(document.createTextNode(' Copy'));
    tableRowDataLink.appendChild(tableRowDataLinkInput);
    tableRowDataLink.appendChild(tableRowDataLinkLabel);

    tableRow.appendChild(tableRowDataName);
    tableRow.appendChild(tableRowDataLink);

    tableBody.appendChild(tableRow);
  }

  table.appendChild(tableBody);

  return table;
}

function createLoadingBall(element) {
  const wrapper = window.document.createElement('div'),
    ball = wrapper.cloneNode(true),
    ball1 = wrapper.cloneNode(true),
    ball2 = wrapper.cloneNode(true),
    ball3 = wrapper.cloneNode(true);

  wrapper.setAttribute('id', 'loading-wrapper');
  ball.setAttribute('class', 'la-ball-fall la-2x');

  ball.appendChild(ball1);
  ball.appendChild(ball2);
  ball.appendChild(ball3);
  wrapper.appendChild(ball);

  if (element) {
    const activeWrapper = window.document.getElementById('loading-wrapper');
    if (activeWrapper) {
      element.removeChild(activeWrapper);
    }

    element.appendChild(wrapper);
  }

  return wrapper;
}
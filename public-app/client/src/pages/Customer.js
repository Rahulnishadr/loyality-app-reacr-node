import React, { useState } from 'react';
import {
  Page,
  Card,
  DataTable,
  Button,
  Modal,
  FormLayout,
  TextField,
  Select,
  BlockStack,
  InlineStack,
  Banner,
} from '@shopify/polaris';
import { DeleteIcon, EditIcon } from '@shopify/polaris-icons';

const durationOptions = [
  { label: 'Select', value: '' },
  { label: 'Month', value: 'Month' },
  { label: 'Week', value: 'Week' },
  { label: 'Days', value: 'Days' },
];

const Customer = () => {
  const initialPoints = [
    { id: 1, duration: '30 Days', createdBy: 'Admin', remarks: 'Monthly expiry' },
  ];
  const [purchaseRows, setPurchaseRows] = useState(initialPoints);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [inputNumber, setInputNumber] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [modalError, setModalError] = useState('');

  const handleDelete = (index) => {
    setPurchaseRows(purchaseRows.filter((_, i) => i !== index));
  };

  const handleAddClick = () => {
    setIsModalOpen(true);
    setEditingIndex(null);
    setInputNumber('');
    setSelectValue('');
    setModalError('');
  };

  const handleEditClick = (index) => {
    setIsModalOpen(true);
    setEditingIndex(index);
    const row = purchaseRows[index];
    setInputNumber(row.duration.split(' ')[0] || '');
    setSelectValue(row.remarks || '');
    setModalError('');
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setInputNumber('');
    setSelectValue('');
    setEditingIndex(null);
    setModalError('');
  };

  const handleSaveClick = () => {
    if (!inputNumber || !selectValue) {
      setModalError('Please fill in all fields');
      return;
    }
    setModalError('');
    const newEntry = {
      id: editingIndex !== null ? purchaseRows[editingIndex].id : purchaseRows.length + 1,
      duration: `${inputNumber} ${selectValue}`,
      createdBy: editingIndex !== null ? purchaseRows[editingIndex].createdBy : 'User',
      remarks: selectValue,
    };
    if (editingIndex !== null) {
      const updatedRows = [...purchaseRows];
      updatedRows[editingIndex] = newEntry;
      setPurchaseRows(updatedRows);
    } else {
      setPurchaseRows([...purchaseRows, newEntry]);
    }
    handleModalClose();
  };

  const tableRows = purchaseRows.map((row, index) => [
    index + 1,
    row.duration,
    row.createdBy,
    <InlineStack gap="200" key={index}>
      <Button
        variant="plain"
        icon={EditIcon}
        accessibilityLabel="Edit"
        onClick={() => handleEditClick(index)}
      />
      <Button
        variant="plain"
        icon={DeleteIcon}
        tone="critical"
        accessibilityLabel="Delete"
        onClick={() => handleDelete(index)}
      />
    </InlineStack>,
  ]);

  return (
    <Page
      title="Expiry Reminder"
      primaryAction={{
        content: 'Add',
        onAction: handleAddClick,
      }}
    >
      <BlockStack gap="400">
        <Card>
          {purchaseRows.length === 0 ? (
            <Banner tone="info">No data available. Click Add to create an entry.</Banner>
          ) : (
            <DataTable
              columnContentTypes={['text', 'text', 'text', 'text']}
              headings={['S. No', 'Duration', 'Created By', 'Action']}
              rows={tableRows}
            />
          )}
        </Card>
        <InlineStack align="end">
          <Button variant="primary">Save</Button>
        </InlineStack>
      </BlockStack>

      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        title={editingIndex !== null ? 'Edit entry' : 'Add entry'}
        primaryAction={{
          content: editingIndex !== null ? 'Save Changes' : 'Create',
          onAction: handleSaveClick,
        }}
        secondaryActions={[
          {
            content: 'Close',
            onAction: handleModalClose,
          },
        ]}
      >
        <Modal.Section>
          {modalError && (
            <Banner tone="critical" onDismiss={() => setModalError('')}>
              {modalError}
            </Banner>
          )}
          <FormLayout>
            <TextField
              label="Number"
              type="number"
              value={inputNumber}
              onChange={setInputNumber}
              placeholder="e.g. 30"
              autoComplete="off"
            />
            <Select
              label="Unit"
              options={durationOptions}
              value={selectValue}
              onChange={setSelectValue}
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </Page>
  );
};

export default Customer;

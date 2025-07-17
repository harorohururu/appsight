
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import BottomNavigationBar from '../components/BottomNavigationBar';
import Breadcrumbs from '../components/Breadcrumbs';
import Header from '../components/Header';
import theme from '../config/theme';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import AlertModal from '../modals/AlertModal';


// Sample data for demonstration
const SAMPLE_LANDMARKS = [
  {
    info_id: 1,
    name: 'St. Peter Church',
    landmark_type: 1,
    address: '123 Church St.',
    total_rooms: 5,
  },
  {
    info_id: 2,
    name: 'Sunrise Resort',
    landmark_type: 2,
    address: '456 Beach Ave.',
    total_rooms: 20,
  },
];

const SAMPLE_LANDMARK_TYPES = [
  { type_id: 1, type_name: 'Church' },
  { type_id: 2, type_name: 'Resort' },
];

const SAMPLE_CONTACTS = [
  { contact_id: 1, landmark_info: 1, name: 'John Doe', email: 'john@example.com', phone: '', telephone: '' },
  { contact_id: 2, landmark_info: 2, name: 'Jane Smith', email: '', phone: '555-1234', telephone: '' },
];

const LandmarksScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [landmarks, setLandmarks] = useState(SAMPLE_LANDMARKS);
  const [filteredLandmarks, setFilteredLandmarks] = useState(SAMPLE_LANDMARKS);
  const [contacts, setContacts] = useState(SAMPLE_CONTACTS);
  const [deleteModal, setDeleteModal] = useState({ visible: false, id: null });
  const [alertModal, setAlertModal] = useState({ visible: false, title: '', message: '', type: 'success', onOk: null });
  const [filterModal, setFilterModal] = useState(false);
  const [selectedType, setSelectedType] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredLandmarks(landmarks);
    } else {
      const filtered = landmarks.filter(landmark => {
        const nameMatch = typeof landmark.name === 'string' && landmark.name.toLowerCase().includes(query.toLowerCase());
        let typeMatch = false;
        const typeObj = landmarkTypes.find(t => t.type_id === landmark.landmark_type);
        if (typeObj && typeObj.type_name.toLowerCase().includes(query.toLowerCase())) {
          typeMatch = true;
        }
        return nameMatch || typeMatch;
      });
      setFilteredLandmarks(filtered);
    }
  };

  const handleEditLandmark = (landmark) => {
    navigation.navigate('editLandmark', { landmark });
  };

  const handleAddLandmark = () => {
    if (user?.role === 'admin') {
      navigation.navigate('addLandmark');
    } else {
      setAlertModal({
        visible: true,
        title: 'Not Authorized',
        message: 'Staff is not authorized to add landmarks.',
        type: 'error',
        onOk: () => setAlertModal(a => ({ ...a, visible: false }))
      });
    }
  };

  const handleDeleteLandmark = (id) => {
    setDeleteModal({ visible: true, id });
  };

  const confirmDeleteLandmark = () => {
    if (!deleteModal.id) return;
    setLandmarks(landmarks.filter(l => l.info_id !== deleteModal.id));
    setFilteredLandmarks(filteredLandmarks.filter(l => l.info_id !== deleteModal.id));
    setContacts(contacts.filter(c => c.landmark_info !== deleteModal.id));
    setDeleteModal({ visible: false, id: null });
    setAlertModal({
      visible: true,
      title: 'Landmark Deleted',
      message: 'The landmark and its contacts were deleted successfully.',
      type: 'success',
      onOk: () => setAlertModal(a => ({ ...a, visible: false })),
    });
  };

  const handleFilterType = (typeId) => {
    setSelectedType(typeId);
    setFilterModal(false);
    if (!typeId) {
      setFilteredLandmarks(landmarks);
    } else {
      setFilteredLandmarks(landmarks.filter(l => l.landmark_type === typeId));
    }
  };

  const getTypeName = (typeId) => {
    const type = landmarkTypes.find(t => t.type_id === typeId);
    return type ? type.type_name : typeId;
  };

  const getLandmarkContacts = (landmark) => {
    const relatedContacts = contacts.filter((c) => c.landmark_info === landmark.info_id);
    return relatedContacts.map((c) => {
      let contactDetail = '';
      if (c.email) contactDetail = c.email;
      else if (c.phone) contactDetail = c.phone;
      else if (c.telephone) contactDetail = c.telephone;
      return `${c.name}${contactDetail ? ' (' + contactDetail + ')' : ''}`;
    });
  };

  const getLandmarkIcon = (typeId) => {
    const type = landmarkTypes.find(t => t.type_id === typeId);
    if (!type) return 'place';
    const name = type.type_name.toLowerCase();
    if (name.includes('church')) return 'church';
    if (name.includes('hotel')) return 'hotel';
    if (name.includes('resort')) return 'pool';
    if (name.includes('restaurant')) return 'restaurant';
    if (name.includes('golf')) return 'golf-course';
    if (name.includes('park')) return 'park';
    if (name.includes('mall')) return 'store-mall-directory';
    if (name.includes('museum')) return 'museum';
    if (name.includes('other')) return 'category';
    return 'place';
  };

  const renderLandmarkCard = ({ item }) => (
    <View style={styles.landmarkCardModern}>
      <View style={styles.landmarkCardHeader}>
        <View style={styles.landmarkIconCircle}>
          <MaterialIcons name={getLandmarkIcon(item.landmark_type)} size={22} color={theme.colors.primary} />
        </View>
        <View className={styles.flex1}>
          <Text style={styles.landmarkName}>{item.name}</Text>
          <Text style={styles.landmarkType}>{getTypeName(item.landmark_type)}</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <MaterialIcons name="location-on" size={16} color={theme.colors.primary} style={styles.infoIcon} />
        <Text style={styles.landmarkAddress}>{item.address}</Text>
      </View>
      {/* Show contacts if available */}
      {getLandmarkContacts(item).length > 0 && (
        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={16} color={theme.colors.primary} style={styles.infoIcon} />
          <View style={styles.contactsList}>
            {getLandmarkContacts(item).map((contact, idx) => (
              <Text key={idx} style={styles.contactText}>{contact}</Text>
            ))}
          </View>
        </View>
      )}
      {/* Show total rooms below contacts if available */}
      {item.total_rooms && (
        <View style={styles.infoRow}>
          <MaterialIcons name="hotel" size={16} color={theme.colors.primary} style={styles.infoIcon} />
          <Text style={styles.roomsText}>{item.total_rooms} rooms</Text>
        </View>
      )}
      <View style={styles.cardFooter}>
        {user?.role === 'admin' && (
          <View style={styles.cardActions}>
            <Text onPress={() => handleEditLandmark(item)} style={styles.editText}>Edit</Text>
            <Text onPress={() => handleDeleteLandmark(item.info_id)} style={styles.deleteText}>Delete</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Manage Landmarks" 
        showBackButton
        navigation={navigation}
        onBackPress={() => navigation.replace('dashboard')}
      />
      <Breadcrumbs items={['Dashboard', 'Landmarks']} />
      <View style={styles.content}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginBottom: 10,
          }}
        >
          <View style={{
            flex: 1,
            marginTop: 8,
            marginBottom: 5,
            backgroundColor: '#ffffff',
            borderRadius: 16,
            paddingLeft: 4,
            paddingRight: 4,
            borderWidth: 1,
            borderColor: '#E0E0E0',
          }}>
            <Searchbar
              placeholder="Search landmarks..."
              placeholderTextColor="#8E8E93"
              onChangeText={handleSearch}
              value={searchQuery}
              style={[styles.searchbar, { backgroundColor: 'transparent', borderWidth: 0 }]}
            />
          </View>
          <TouchableOpacity style={[styles.addButtonIconOnly, { width: 44, height: 44, marginLeft: 0 }]} onPress={() => setFilterModal(true)} activeOpacity={0.7}>
            <MaterialIcons name="filter-list" size={22} color={theme.colors.onPrimary} />
          </TouchableOpacity>
          {user?.role === 'admin' && (
            <TouchableOpacity style={[styles.addButtonIconOnly, { width: 44, height: 44, marginLeft: 0 }]} onPress={handleAddLandmark} activeOpacity={0.7}>
              <MaterialIcons name="add" size={22} color={theme.colors.onPrimary} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.resultCount}>
              {filteredLandmarks.length} landmark{filteredLandmarks.length !== 1 ? 's' : ''} found
          </Text>
        </View>
        <View style={styles.grid1Container}>
          {filteredLandmarks.map((item) => (
            <View key={item.info_id} style={styles.grid1CardWrapper}>
              {renderLandmarkCard({ item })}
            </View>
          ))}
        </View>
        {/* Filter Modal */}
        <Modal
          visible={filterModal}
          transparent
          animationType="fade"
          onRequestClose={() => setFilterModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.filterModal}>
              <View style={styles.filterModalHeader}>
                <Text style={styles.filterTitle}>Filter by Type</Text>
              </View>
              <TouchableOpacity
                style={[styles.filterOption, !selectedType && styles.filterOptionSelected]}
                onPress={() => handleFilterType('')}
              >
                <Text style={[styles.filterOptionText, !selectedType && styles.filterOptionTextSelected]}>All</Text>
              </TouchableOpacity>
              {landmarkTypes.map(type => (
                <TouchableOpacity
                  key={type.type_id}
                  style={[styles.filterOption, selectedType === type.type_id && styles.filterOptionSelected]}
                  onPress={() => handleFilterType(type.type_id)}
                >
                  <Text style={[styles.filterOptionText, selectedType === type.type_id && styles.filterOptionTextSelected]}>{type.type_name}</Text>
                </TouchableOpacity>
              ))}
              {/* X button to close modal */}
              <TouchableOpacity style={styles.filterModalCloseIcon} onPress={() => setFilterModal(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <BottomNavigationBar navigation={navigation} currentRoute="landmarks" />
      <AlertModal
        visible={deleteModal.visible}
        title="Delete Landmark"
        message="Are you sure you want to delete this landmark? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        onConfirm={confirmDeleteLandmark}
        onCancel={() => setDeleteModal({ visible: false, id: null })}
      />
      <AlertModal
        visible={alertModal.visible}
        title={alertModal.title}
        message={alertModal.message}
        confirmText="OK"
        type={alertModal.type}
        onConfirm={alertModal.onOk ? alertModal.onOk : () => setAlertModal(a => ({ ...a, visible: false }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    width: '100%',
  },
  landmarkCardModern: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: theme.spacing.xs,
    marginBottom: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    boxSizing: 'border-box',
  },
    filterModalCloseIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  resultCount: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#8E8E93',
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.2,
  },  
  landmarkCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    width: '100%',
    gap: 12,
  },
  addButtonIconOnly: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 0
  },
  landmarkName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: theme.colors.primary,
    marginBottom: 0,
  },
  landmarkType: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: theme.colors.onSurfaceVariant,
    marginBottom: 0,
  },
  landmarkAddress: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: theme.colors.onSurfaceVariant,
    marginBottom: 0,
    marginTop: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    width: '100%',
    paddingLeft: 0,
    marginLeft: 0,
    justifyContent: 'space-between',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginLeft: 0,
    paddingLeft: 0,
  },
  roomsText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: theme.colors.onSurfaceVariant,
    marginRight: 0,
    paddingLeft: 0,
    marginLeft: 0,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  marginBottomMd: {
    marginBottom: theme.spacing.md,
  },
  marginTop4: {
    marginTop: 4,
  },
  contactsLabel: {
    fontSize: 12,
    color: '#666',
  },
  contactText: {
    fontSize: 12,
    color: '#444',
  },
  editText: {
    marginRight: 0,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  deleteText: {
    color: theme.colors.error,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
    marginBottom: 2,
    gap: 4,
  },
  infoIcon: {
    marginTop: 2,
    marginRight: 6,
  },
  contactsList: {
    flex: 1,
    flexDirection: 'column',
    gap: 0,
  },
  // Filter modal styles
  filterModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  filterModalCenteredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    minWidth: 220,
    maxWidth: 260,
    width: '90%',
    alignItems: 'center',
    elevation: 4,
  },
  filterModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
    position: 'relative',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    flex: 1,
    textAlign: 'center',
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    width: 180,
    alignItems: 'center',
  },
  filterOptionSelected: {
    backgroundColor: theme.colors.primary,
  },
  filterOptionText: {
    fontSize: 15,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  filterCloseText: {
    color: '#8B0000',
    fontWeight: '600',
    fontSize: 15,
  },
  filterOptionTextSelected: {
    color: '#fff',
  },
});

const landmarkTypes = SAMPLE_LANDMARK_TYPES;

export default LandmarksScreen;

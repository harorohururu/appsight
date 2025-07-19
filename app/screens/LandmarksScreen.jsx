import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { Text } from "react-native-paper";
import BottomNavigationBar from "../components/BottomNavigationBar";
import Header from "../components/Header";
import { API_URL } from "../config/config";
import theme from "../config/theme";
import { useNavigation } from "../context/NavigationContext";
import AlertModal from "../modals/AlertModal";
import AddLandmarkModal from "../modals/AddLandmarkModal";


const LandmarksScreen = () => {
  const navigation = useNavigation();
  const [landmarks, setLandmarks] = useState([]);
  const [filteredLandmarks, setFilteredLandmarks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [landmarkTypes, setLandmarkTypes] = useState([]);

  useEffect(() => {
    // Fetch all landmarks with joined data from backend and group contacts per landmark
    const fetchLandmarks = async () => {
      try {
        const res = await fetch(`${API_URL}/landmarks`);
        const data = await res.json();
        // Group contacts for each landmark
        const grouped = {};
        data.forEach((row) => {
          if (!grouped[row.info_id]) {
            grouped[row.info_id] = {
              ...row,
              contacts: [],
            };
          }
          if (row.contact_id) {
            grouped[row.info_id].contacts.push({
              contact_id: row.contact_id,
              name: row.contact_name,
              email: row.email,
              phone: row.phone,
              telephone: row.telephone,
            });
          }
        });
        const landmarksArr = Object.values(grouped);
        setLandmarks(landmarksArr);
        setFilteredLandmarks(landmarksArr);
      } catch (err) {
        console.error("[LandmarksScreen] Error fetching landmarks:", err);
        setLandmarks([]);
        setFilteredLandmarks([]);
      }
    };
    fetchLandmarks();
  }, []);
  const [deleteModal, setDeleteModal] = useState({ visible: false, id: null });
  // Gradients always visible, no scroll logic needed
  const [alertModal, setAlertModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success",
    onOk: null,
  });
  const [filterModal, setFilterModal] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);

  const handleEditLandmark = (landmark) => {
    navigation.navigate("editLandmark", { landmark });
  };

  const handleAddLandmark = () => {
    setAddModalVisible(true);
  };

  const handleDeleteLandmark = (id) => {
    setDeleteModal({ visible: true, id });
  };

  const confirmDeleteLandmark = () => {
    if (!deleteModal.id) return;
    fetch(`${API_URL}/landmarks/${deleteModal.id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (res.ok) {
          setLandmarks(landmarks.filter((l) => l.info_id !== deleteModal.id));
          setFilteredLandmarks(
            filteredLandmarks.filter((l) => l.info_id !== deleteModal.id)
          );
          setContacts(
            contacts.filter((c) => c.landmark_info !== deleteModal.id)
          );
          setDeleteModal({ visible: false, id: null });
          setAlertModal({
            visible: true,
            title: "Landmark Deleted",
            message: "The landmark and its contacts were deleted successfully.",
            type: "success",
            onOk: () => setAlertModal((a) => ({ ...a, visible: false })),
          });
        } else {
          let errorMsg = "Failed to delete landmark. Please try again.";
          try {
            const errorData = await res.json();
            if (errorData.details) errorMsg += `\nReason: ${errorData.details}`;
          } catch {}
          setDeleteModal({ visible: false, id: null });
          setAlertModal({
            visible: true,
            title: "Delete Failed",
            message: errorMsg,
            type: "error",
            onOk: () => setAlertModal((a) => ({ ...a, visible: false })),
          });
        }
      })
      .catch((err) => {
        setDeleteModal({ visible: false, id: null });
        setAlertModal({
          visible: true,
          title: "Delete Failed",
          message: `Failed to delete landmark.\n${err?.message || ""}`,
          type: "error",
          onOk: () => setAlertModal((a) => ({ ...a, visible: false })),
        });
      });
  };

  const handleFilterType = (typeId) => {
    setSelectedType(typeId);
    setFilterModal(false);
    if (!typeId) {
      setFilteredLandmarks(landmarks);
    } else {
      setFilteredLandmarks(landmarks.filter((l) => l.landmark_type === typeId));
    }
  };

  // Use type_name directly from joined data
  const getTypeName = (item) => item.type_name || item.landmark_type;

  // Use contacts array grouped per landmark
  const getLandmarkContacts = (item) => {
    if (!item.contacts || item.contacts.length === 0) return ["None"];
    return item.contacts
      .map((c) => {
        // Prefer contact_type and value fields if present
        if (c.contact_type && c.value) {
          return `${c.name} (${
            c.contact_type.charAt(0).toUpperCase() + c.contact_type.slice(1)
          }: ${c.value})`;
        }
        let contactType = "";
        let contactValue = "";
        if (c.email) {
          contactType = "Email";
          contactValue = c.email;
        } else if (c.phone) {
          contactType = "Phone";
          contactValue = c.phone;
        } else if (c.telephone) {
          contactType = "Telephone";
          contactValue = c.telephone;
        }
        if (!contactValue) return null;
        return `${c.name}${
          contactValue ? " (" + contactType + ": " + contactValue + ")" : ""
        }`;
      })
      .filter(Boolean);
  };

  const getLandmarkIcon = (item) => {
    const name = (item.type_name || "").toLowerCase();
    if (name.includes("church")) return "church";
    if (name.includes("hotel")) return "hotel";
    if (name.includes("resort")) return "pool";
    if (name.includes("restaurant")) return "restaurant";
    if (name.includes("golf")) return "golf-course";
    if (name.includes("park")) return "park";
    if (name.includes("mall")) return "store-mall-directory";
    if (name.includes("museum")) return "museum";
    if (name.includes("other")) return "category";
    return "place";
  };

  const renderLandmarkCard = ({ item }) => (
    <View style={styles.landmarkCardModern}>
      <View style={styles.landmarkCardHeader}>
        <View style={styles.landmarkIconCircle}>
          <MaterialIcons
            name={getLandmarkIcon(item)}
            size={22}
            color={theme.colors.primary}
          />
        </View>
        <View className={styles.flex1}>
          <Text style={styles.landmarkName}>{item.name}</Text>
          <Text style={styles.landmarkType}>{getTypeName(item)}</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <MaterialIcons
          name="location-on"
          size={16}
          color={theme.colors.primary}
          style={styles.infoIcon}
        />
        <Text style={styles.landmarkAddress}>
          {item.address ? item.address : "None"}
        </Text>
      </View>
      {/* Show contacts if available */}
      {getLandmarkContacts(item).length > 0 && (
        <View style={styles.infoRow}>
          <MaterialIcons
            name="person"
            size={16}
            color={theme.colors.primary}
            style={styles.infoIcon}
          />
          <View style={styles.contactsList}>
            {getLandmarkContacts(item).map((contact, idx) => (
              <Text key={idx} style={styles.contactText}>
                {contact}
              </Text>
            ))}
          </View>
        </View>
      )}
      {/* Show total rooms below contacts if available */}
      {item.total_rooms && (
        <View style={styles.infoRow}>
          <MaterialIcons
            name="hotel"
            size={16}
            color={theme.colors.primary}
            style={styles.infoIcon}
          />
          <Text style={styles.roomsText}>{item.total_rooms} rooms</Text>
        </View>
      )}
      <View style={styles.cardFooter}>
        <View style={styles.cardActions}>
          <Text
            onPress={() => handleEditLandmark(item)}
            style={styles.editText}
          >
            Edit
          </Text>
          <Text
            onPress={() => handleDeleteLandmark(item.info_id)}
            style={styles.deleteText}
          >
            Delete
          </Text>
        </View>
      </View>
    </View>
  );

  const [menuVisible, setMenuVisible] = useState(null);

  return (
    <View style={styles.screenBackground}>
      <Header
        title="Landmark"
        navigation={navigation}
        onBackPress={() => navigation.replace("dashboard")}
      />
      <View style={styles.contentBackground}>
        <View style={styles.optionsRow}>
          <View style={styles.searchWrapper}>
            <MaterialIcons
              name="search"
              size={22}
              color={theme.colors.tertiary}
              style={styles.searchIconLeft}
            />
            <TextInput
              style={styles.searchInputWide}
              placeholder="Search..."
              placeholderTextColor={theme.colors.tertiary}
              editable={true}
              value={searchText}
              onChangeText={text => {
                setSearchText(text);
                if (!text) {
                  setFilteredLandmarks(landmarks);
                } else {
                  setFilteredLandmarks(
                    landmarks.filter(l =>
                      (l.name && l.name.toLowerCase().includes(text.toLowerCase())) ||
                      (l.address && l.address.toLowerCase().includes(text.toLowerCase()))
                    )
                  );
                }
              }}
              returnKeyType="search"
            />
          </View>
          <View style={styles.iconGroup}>
            <MaterialIcons
              name="add"
              size={32}
              color={theme.colors.primary}
              style={styles.filterIcon}
              onPress={handleAddLandmark}
            />
            <MaterialIcons
              name="tune"
              size={32}
              color={theme.colors.primary}
              style={styles.filterIcon}
              onPress={() => setFilterModal(true)}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          {/* Top Gradient Overlay (smooth fade, same as bottom) */}
          <LinearGradient
            colors={[
              "#fdfffc",
              "rgba(253,255,252,0.8)",
              "rgba(253,255,252,0.5)",
              "rgba(253,255,252,0.2)",
              "rgba(253,255,252,0)",
            ]}
            style={styles.topGradient}
            pointerEvents="none"
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />

          {/* Top Gradient Overlay removed as requested */}
          {/* Landmark List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.landmarkListContent}
          >
            {filteredLandmarks.length === 0
              ? null
              : filteredLandmarks.map((item) => (
                  <View key={item.info_id} style={styles.cardContainer}>
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.cardIconCircle}>
                        <MaterialIcons
                          name={getLandmarkIcon(item)}
                          size={32}
                          color={theme.colors.secondary}
                        />
                      </View>
                      <View style={styles.cardHeaderTextWrapper}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <Text style={styles.cardSubtitle}>{getTypeName(item)}</Text>
                        <Text style={styles.cardMeta}>{item.address || "None"}</Text>
                      </View>
                      <View style={styles.cardMenuIconWrapper}>
                        <TouchableOpacity onPress={() => setMenuVisible(item.info_id)}>
                          <MaterialIcons name="more-vert" size={22} color={theme.colors.tertiary} />
                        </TouchableOpacity>
                        {menuVisible === item.info_id && (
                          <View style={styles.cardMenuDropdown}>
                            <TouchableOpacity onPress={() => { setMenuVisible(null); handleEditLandmark(item); }}>
                              <Text style={styles.cardMenuItem}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setMenuVisible(null); handleDeleteLandmark(item.info_id); }}>
                              <Text style={styles.cardMenuItemDelete}>Delete</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={styles.cardInfoRow}>
                      <Text style={styles.cardInfoLabel}>Contacts:</Text>
                      <Text style={styles.cardInfoValue}>{getLandmarkContacts(item).join(", ")}</Text>
                    </View>
                    {item.total_rooms && (
                      <View style={styles.cardInfoRow}>
                        <Text style={styles.cardInfoLabel}>Rooms:</Text>
                        <Text style={styles.cardInfoValue}>{item.total_rooms}</Text>
                      </View>
                    )}
                    <View style={styles.cardFooterRow}>
                      <Text style={styles.cardDate}>{formatDateTime(item.updated_at || item.created_at)}</Text>
                    </View>
                  </View>
                ))}
          </ScrollView>
          {/* Bottom Gradient Overlay (transparent to white, always visible, more white, taller) */}
          <LinearGradient
            colors={[
              "rgba(253,255,252,0)", // fully transparent
              "rgba(253,255,252,0.2)", // slight opacity
              "rgba(253,255,252,0.5)", // medium opacity
              "rgba(253,255,252,0.8)", // almost solid
              "#fdfffc", // solid color
            ]}
            style={styles.bottomGradient}
            pointerEvents="none"
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </View>
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
        onConfirm={
          alertModal.onOk
            ? alertModal.onOk
            : () => setAlertModal((a) => ({ ...a, visible: false }))
        }
      />
      <AddLandmarkModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        animationType="slide"
        fullScreen={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingHorizontal: 2,
    gap: 0,
    width: '100%',
  },
  searchWrapper: {
    position: 'relative',
    justifyContent: 'center',
    flex: 1,
    marginRight: 12,
    minWidth: 0,
  },
  searchIconLeft: {
    position: 'absolute',
    left: 10,
    top: 7,
    zIndex: 2,
  },
  searchInputWide: {
    height: 38,
    width: '100%',
    minWidth: 220,
    backgroundColor: theme.colors.secondary,
    borderRadius: 18,
    paddingLeft: 40,
    paddingRight: 16,
    color: theme.colors.tertiary,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    zIndex: 10,
    width: "100%",
    pointerEvents: "none",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    zIndex: 10,
    width: "100%",
    pointerEvents: "none",
  },
  screenBackground: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  contentBackground: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.md,
  },
  filterIcon: {
    padding: 4,
    marginLeft: 4,
  },
  addLandmarkButton: {
    padding: 4,
  },
  landmarkListContainer: {
    flex: 1,
    width: "100%",
  },
  landmarkListContent: {
    paddingTop: 10,
    paddingBottom: 90,
  },
  landmarkCardModern: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
    marginBottom: 0,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  landmarkCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  landmarkIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  flex1: {
    flex: 1,
  },
  landmarkName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.tertiary,
  },
  landmarkType: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: theme.colors.tertiary,
    marginTop: 2,
  },
  landmarkAddress: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.tertiary,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    marginRight: 8,
  },
  contactsList: {
    flexDirection: 'column',
  },
  contactText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.tertiary,
  },
  roomsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.tertiary,
  },
  cardFooter: {
    marginTop: 8,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  editText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: theme.colors.primary,
    marginRight: 16,
  },
  deleteText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: theme.colors.error,
  },
  optionsRowAligned: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 12,
    paddingHorizontal: theme.spacing.md,
    width: '100%',
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 12,
  },
  cardContainer: {
    backgroundColor: theme.colors.secondary,
    borderBottomWidth: 2,
    borderColor: theme.colors.shadow,
    marginBottom: 2,
    paddingVertical: 5,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIconCircle: {
    width: 44,
    height: 44,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 22,
  },
  cardHeaderTextWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.tertiary,
  },
  cardSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: theme.colors.tertiary,
    marginTop: 2,
  },
  cardMeta: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.tertiary,
    marginTop: 2,
  },
  cardMenuIconWrapper: {
    marginLeft: 8,
    position: 'relative',
  },
  cardMenuDropdown: {
    position: 'absolute',
    top: 28,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 100,
    minWidth: 90,
    paddingVertical: 4,
  },
  cardMenuItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontFamily: 'Poppins-Bold',
    color: theme.colors.primary,
    fontSize: 14,
  },
  cardMenuItemDelete: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontFamily: 'Poppins-Bold',
    color: theme.colors.error,
    fontSize: 14,
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardInfoLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: theme.colors.tertiary,
    marginRight: 4,
  },
  cardInfoValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.tertiary,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cardDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.tertiary,
  },
  modalFullScreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const dateObj = new Date(dateString);
  const date = dateObj.toLocaleDateString();
  const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${date} ${time}`;
};

// landmarkTypes now comes from state, fetched from backend

export default LandmarksScreen;

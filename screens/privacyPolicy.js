import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";

const PrivacyPolicy = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>

      <Text style={styles.subtitle}>Effective Date: December 10, 2023</Text>

      <Text style={styles.paragraph}>
        Thank you for choosing Inventory Manager X (IMX) developed by Megabyte
        Computers, Inc. This Privacy Policy is meant to inform you about how we
        collect, use, and safeguard your personal information when you use our
        app, as well as your rights and choices regarding your data. By using
        our service, you agree to the practices outlined in this Privacy Policy.
      </Text>

      <Text style={styles.sectionTitle}>Information Collection</Text>

      <Text style={styles.paragraph}>We collect two types of information:</Text>

      <Text style={styles.subTitle}>1. Personal Information:</Text>
      <Text style={styles.paragraph}>
        This includes data you voluntarily provide to us, like your name, email
        address, postal address, phone number, etc.
      </Text>

      <Text style={styles.subTitle}>2. Non-Personal Information:</Text>
      <Text style={styles.paragraph}>
        This type of information is collected automatically, such as device
        details, browser type, log data, and usage patterns, to enhance the
        functionality and user experience of the app.
      </Text>

      <Text style={styles.paragraph}>
        We may also receive information from third-party sources and handle it
        according to this Privacy Policy.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Use of Information</Text>
        <Text style={styles.listItem}>
          a. Provide, maintain, and enhance our service.
        </Text>
        <Text style={styles.listItem}>
          b. Respond to your inquiries and requests.
        </Text>
        <Text style={styles.listItem}>
          c. Send you promotional materials and updates, as per your
          preferences.
        </Text>
        <Text style={styles.listItem}>
          d. Personalize your experience and display tailored content and
          advertisements.
        </Text>
        <Text style={styles.listItem}>
          e. Comply with applicable laws and legal processes.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Data Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to access, correct, or delete your personal
          information. Please contact us using the information provided below to
          exercise these rights.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Information Sharing and Disclosure
        </Text>
        <Text style={styles.paragraph}>
          We do not sell, trade, or transfer your personal information to third
          parties. However, we may share non-personal, aggregated information
          with third parties for analytical purposes and service improvement.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Third-Party Services</Text>
        <Text style={styles.paragraph}>
          Our app may integrate with third-party services like Google Workspace
          APIs. Your usage of these services is subject to their respective
          privacy policies.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <Text style={styles.paragraph}>
          While we take reasonable measures to protect your information from
          unauthorized access, alteration, or disclosure, no data transmission
          or storage can be guaranteed to be 100% secure.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Changes to this Privacy Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy periodically. Any changes will be
          posted on this page along with a revised "Effective Date." Your
          continued use of the app after the revised Privacy Policy indicates
          your acceptance of the changes.
        </Text>
      </View>

      <Text style={styles.contact}>
        If you have any questions, concerns, or requests regarding this Privacy
        Policy or our data practices, please contact us at:{" "}
        <Text style={styles.contactEmail}>appsbymbc@gmail.com</Text>
      </Text>

      <Text style={styles.footer}>
        By using Inventory Manager X (IMX), you acknowledge and consent to the
        practices described in this Privacy Policy.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 15,
  },
  contact: {
    fontSize: 16,
    marginTop: 20,
  },
  contactEmail: {
    textDecorationLine: "underline",
  },
  footer: {
    fontSize: 12,
    marginTop: 20,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 50,
  },
  section: {
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default PrivacyPolicy;

import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <View style={styles.safeAreaContainer}>
      <ScrollView>
        <Text
          style={{
            fontSize: 15,
            textAlign: "justify",
            margin: 15,
          }}
        >
          Megabyte Computers, Inc. Privacy Policy Effective Date: December 10,
          2023 Thank you for using Inventory Manager X (IMX) ("the App" or “the
          Service”), developed by Megabyte Computers, Inc. This Privacy Policy
          is designed to inform you about the types of personal information we
          collect when you use the App, how we use and safeguard that
          information, and your rights and choices concerning your data. By
          accessing or using our Service, you agree to the practices described
          in this Privacy Policy. Information Collection: Personal Information:
          We may collect personal information that you voluntarily provide to us
          when you interact with our Service. This may include your name, email
          address, postal address, phone number, or other identifying
          information. Non-Personal Information: We may collect non-personal
          information, such as device information, browser type, log data, and
          usage patterns, to improve the App's functionality and user
          experience. Information from Third Parties: We may receive information
          from third-party sources and combine it with the information we
          collect through our Service. We will handle such information in
          accordance with this Privacy Policy. Use of Information We use the
          collected information to: a. Provide, maintain, and improve our
          Service. b. Respond to your inquiries, requests, or customer service
          needs. c. Send you promotional materials, updates, or other
          communications, subject to your preferences. d. Personalize your
          experience and present tailored content and advertisements. e. Comply
          with applicable laws, regulations, and legal processes. Your Data
          Rights You have the right to access, correct, or delete your personal
          information. Please contact us using the information provided below to
          exercise these rights. Information Sharing and Disclosure: We do not
          sell, trade, or transfer your personal information to third parties.
          We may share non-personal, aggregated information with third parties
          for analytical purposes and to improve our services. Third-Party
          Services: The App may integrate with third-party services, such as
          Google Workspace APIs, to provide its functionality. Your usage of
          those services is subject to their respective privacy policies. The
          app use and transfer to any other app of information received from
          Google APIs will adhere to Google API Services User Data Policy,
          including the Limited Use requirements. Security: We take reasonable
          measures to protect your information from unauthorized access,
          alteration, or disclosure. However, no data transmission or storage
          can be guaranteed to be 100% secure. While we strive to protect your
          information, we cannot ensure absolute security. Changes to this
          Privacy Policy: We may update this Privacy Policy from time to time.
          Any changes will be posted on this page with a revised "Effective
          Date." Your continued use of the App after the revised Privacy Policy
          has become effective indicates your acceptance of the changes. Contact
          Us: If you have any questions, concerns, or requests related to this
          Privacy Policy or our data practices, please contact us at:
          appsbymbc@gmail.com By using Inventory Manager X (IMX), you
          acknowledge and consent to the practices described in this Privacy
          Policy.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "white",
  },
});

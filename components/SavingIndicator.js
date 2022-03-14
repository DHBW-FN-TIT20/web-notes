// @ts-check
import { Component } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import styles from './SavingIndicator.module.css';
import { Icon } from '@fluentui/react/lib/Icon';

/** 
 * @class Saving Indicator Component Class
 * @component
 * @category Components
 */
export class SavingIndicator extends Component {
  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    if (this.props.isSaving && !this.props.isSaved) {
      // return the animation to view while saving
      return (
        <div className={`${styles.isSaving} ${styles.container}`}>
          <ClipLoader
            size={20}
            color={"black"}
            loading={true}
          />
        </div>
      )
    } else if (!this.props.isSaving && this.props.isSaved) {
      // return the icon to view when saved successfully
      return (
        <div className={`${styles.isSaved} ${styles.container}`}>
          <Icon iconName="Checkmark" className={styles.icon} />
        </div>
      )
    } else {
      // return the icon to view when not saved
      return (
        <div className={`${styles.isNotSaved} ${styles.container}`}>
          <Icon iconName="Cancel" className={styles.icon} />
        </div>
      )
    }
  }
}

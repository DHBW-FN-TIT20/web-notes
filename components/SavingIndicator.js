import { Component } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import SyncLoader from 'react-spinners/SyncLoader';
import PulseLoader from 'react-spinners/PulseLoader';
import styles from './SavingIndicator.module.css';

/** 
 * @class Saving Indicator Component Class
 * @component
 */
class SavingIndicator extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    /**
     * Generates the JSX Output for the Client
     * @returns JSX Output
     */
    render() {

        if (this.props.isSaving && !this.props.isSaved) {
            return (
                <div className={`${styles.isSaving} ${styles.container}`}>
                    <ClipLoader
                        size={17}
                        color={"white"}
                        loading={true}
                    />
                </div>
            )
        } else if (!this.props.isSaving && this.props.isSaved) {
            return (
                <div className={`${styles.isSaved} ${styles.container}`}>
                    <p>✓</p>
                </div>
            )
        } else {

            if (this.props.notSaveMessage) {
                return (
                    <div className={`${styles.notSaved} ${styles.container}`}>
                        <p>{this.props.notSaveMessage}</p>
                    </div>
                )
            } else {
                return (
                    <div className={`${styles.isNotSaved} ${styles.container}`}>
                        <SyncLoader
                            size={3}
                            color={"grey"}
                            loading={true}
                            speedMultiplier={0.7}
                        />
                    </div>

                )
            }
        }
    }
}


export default SavingIndicator
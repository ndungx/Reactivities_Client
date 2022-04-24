import React from 'react'
import { combineValidators, isRequired } from 'revalidate';
import { IProfile } from '../../app/models/profile';
import { Field, Form as FinalForm } from 'react-final-form';
import { Button, Form } from 'semantic-ui-react';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import TextInput from '../../app/common/form/TextInput';

interface IProps {
    updateProfile: (profile: IProfile) => void;
    profile: IProfile;
}

const validate = combineValidators({
    displayName: isRequired('displayName'),
});

const ProfileEditForm: React.FC<IProps> = ({ updateProfile, profile }) => {
    return (
        <FinalForm
            onSubmit={updateProfile}
            validate={validate}
            initialValues={profile!}
            render={({ handleSubmit, invalid, pristine, submitting }) => (
                <Form onSubmit={handleSubmit} error>
                    <Field
                        name='displayName'
                        component={TextInput}
                        placeholder='Display Name'
                    />
                    <Field
                        name='bio'
                        component={TextAreaInput}
                        rows={3}
                        placeholder='Bio'
                        value={profile!.bio}
                    />

                    <Button
                        floated='right'
                        positive
                        content='Update Profile'
                        disabled={invalid || pristine}
                        loading={submitting}
                    />
                </Form>
            )}
        >

        </FinalForm>
    )
}

export default ProfileEditForm
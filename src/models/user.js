const _userProps = new WeakMap();

export default class User {
    constructor(decodedToken) {
        if (decodedToken) {
            const { whom } = decodedToken;
            _userProps.set(this, {
                id: whom.id,
                firstName: whom.fname,
                lastName: whom.lname,
                email: whom.email,
            });
        }
    }

    get id() { return _userProps.get(this).id }
    
    set id(id) { _userProps.get(this).id = id }

    get firstName() { return _userProps.get(this).firstName }
    
    set firstName(firstName) { _userProps.get(this).firstName = firstName }

    get lastName() { return _userProps.get(this).lastName }
    
    set lastName(lastName) { _userProps.get(this).lastName = lastName }
    set sex(sex) { _userProps.get(this).sex = sex }

    get email() { return _userProps.get(this).email }
    
    set email(email) { _userProps.get(this).email = email }

}